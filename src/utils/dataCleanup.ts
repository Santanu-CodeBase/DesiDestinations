// Data cleanup utility for removing all user data from localStorage
export class DataCleanup {
  
  /**
   * Clean all user-related data from localStorage
   * Preserves app structure and functionality
   */
  static cleanAllUserData(): {
    success: boolean;
    message: string;
    itemsRemoved: string[];
  } {
    const itemsRemoved: string[] = [];
    
    try {
      // Get all localStorage keys
      const allKeys = Object.keys(localStorage);
      
      // Remove all user account data (pattern: desiDestinations_user_*)
      const userKeys = allKeys.filter(key => key.startsWith('desiDestinations_user_'));
      userKeys.forEach(key => {
        localStorage.removeItem(key);
        itemsRemoved.push(key);
      });
      
      // Remove current logged-in user
      if (localStorage.getItem('desiDestinationsEmail')) {
        localStorage.removeItem('desiDestinationsEmail');
        itemsRemoved.push('desiDestinationsEmail');
      }
      
      // Remove search history
      if (localStorage.getItem('searchHistory')) {
        localStorage.removeItem('searchHistory');
        itemsRemoved.push('searchHistory');
      }
      
      // Remove notifications
      if (localStorage.getItem('notifications')) {
        localStorage.removeItem('notifications');
        itemsRemoved.push('notifications');
      }
      
      // Remove any other app-specific data that might exist
      const appDataKeys = allKeys.filter(key => 
        key.startsWith('desiDestinations') && 
        !userKeys.includes(key) && 
        key !== 'desiDestinationsEmail'
      );
      
      appDataKeys.forEach(key => {
        localStorage.removeItem(key);
        itemsRemoved.push(key);
      });
      
      return {
        success: true,
        message: `Successfully cleaned ${itemsRemoved.length} data items`,
        itemsRemoved
      };
      
    } catch (error) {
      console.error('Error during data cleanup:', error);
      return {
        success: false,
        message: 'Failed to clean user data',
        itemsRemoved
      };
    }
  }
  
  /**
   * Get current data statistics
   */
  static getDataStats(): {
    userAccounts: number;
    searchHistoryItems: number;
    notificationItems: number;
    totalDataItems: number;
  } {
    try {
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('desiDestinations_user_'));
      
      const searchHistory = localStorage.getItem('searchHistory');
      const notifications = localStorage.getItem('notifications');
      
      const searchHistoryItems = searchHistory ? JSON.parse(searchHistory).length : 0;
      const notificationItems = notifications ? JSON.parse(notifications).length : 0;
      
      return {
        userAccounts: userKeys.length,
        searchHistoryItems,
        notificationItems,
        totalDataItems: allKeys.filter(key => key.startsWith('desiDestinations')).length
      };
    } catch (error) {
      console.error('Error getting data stats:', error);
      return {
        userAccounts: 0,
        searchHistoryItems: 0,
        notificationItems: 0,
        totalDataItems: 0
      };
    }
  }
  
  /**
   * Reset app to initial state (force logout and clear data)
   */
  static resetAppState(): void {
    // Clean all data first
    this.cleanAllUserData();
    
    // Force page reload to reset React state
    window.location.reload();
  }
}