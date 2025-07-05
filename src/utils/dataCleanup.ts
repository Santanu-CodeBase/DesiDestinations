// Enhanced data cleanup utility for complete removal of all user data
export class DataCleanup {
  
  /**
   * Clean all user-related data from localStorage with comprehensive coverage
   * Preserves app structure and functionality
   */
  static cleanAllUserData(): {
    success: boolean;
    message: string;
    itemsRemoved: string[];
    errors: string[];
  } {
    const itemsRemoved: string[] = [];
    const errors: string[] = [];
    
    try {
      // Get all localStorage keys before starting cleanup
      const allKeys = Object.keys(localStorage);
      console.log('Starting cleanup. Found keys:', allKeys);
      
      // Remove all user account data (pattern: desiDestinations_user_*)
      const userKeys = allKeys.filter(key => key.startsWith('desiDestinations_user_'));
      console.log('User account keys to remove:', userKeys);
      
      userKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          itemsRemoved.push(key);
          console.log('Removed user key:', key);
        } catch (error) {
          errors.push(`Failed to remove ${key}: ${error}`);
        }
      });
      
      // Remove current logged-in user session
      if (localStorage.getItem('desiDestinationsEmail')) {
        try {
          localStorage.removeItem('desiDestinationsEmail');
          itemsRemoved.push('desiDestinationsEmail');
          console.log('Removed current session');
        } catch (error) {
          errors.push(`Failed to remove session: ${error}`);
        }
      }
      
      // Remove search history
      if (localStorage.getItem('searchHistory')) {
        try {
          localStorage.removeItem('searchHistory');
          itemsRemoved.push('searchHistory');
          console.log('Removed search history');
        } catch (error) {
          errors.push(`Failed to remove search history: ${error}`);
        }
      }
      
      // Remove notifications
      if (localStorage.getItem('notifications')) {
        try {
          localStorage.removeItem('notifications');
          itemsRemoved.push('notifications');
          console.log('Removed notifications');
        } catch (error) {
          errors.push(`Failed to remove notifications: ${error}`);
        }
      }
      
      // Remove any other app-specific data
      const appDataKeys = allKeys.filter(key => 
        key.startsWith('desiDestinations') && 
        !userKeys.includes(key) && 
        key !== 'desiDestinationsEmail' &&
        key !== 'searchHistory' &&
        key !== 'notifications'
      );
      
      console.log('Additional app data keys to remove:', appDataKeys);
      
      appDataKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          itemsRemoved.push(key);
          console.log('Removed app data key:', key);
        } catch (error) {
          errors.push(`Failed to remove ${key}: ${error}`);
        }
      });
      
      // Additional cleanup for any remaining user-related data
      const remainingKeys = Object.keys(localStorage);
      const suspiciousKeys = remainingKeys.filter(key => 
        key.toLowerCase().includes('user') || 
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('login') ||
        key.toLowerCase().includes('session')
      );
      
      if (suspiciousKeys.length > 0) {
        console.log('Found suspicious remaining keys:', suspiciousKeys);
        suspiciousKeys.forEach(key => {
          try {
            localStorage.removeItem(key);
            itemsRemoved.push(key);
            console.log('Removed suspicious key:', key);
          } catch (error) {
            errors.push(`Failed to remove suspicious key ${key}: ${error}`);
          }
        });
      }
      
      // Verify cleanup was successful
      const finalKeys = Object.keys(localStorage);
      const remainingUserData = finalKeys.filter(key => 
        key.startsWith('desiDestinations') ||
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('auth')
      );
      
      console.log('Cleanup complete. Remaining keys:', finalKeys);
      console.log('Remaining user data keys:', remainingUserData);
      
      const success = errors.length === 0;
      const message = success 
        ? `Successfully cleaned ${itemsRemoved.length} data items. Database is now empty.`
        : `Cleaned ${itemsRemoved.length} items with ${errors.length} errors.`;
      
      return {
        success,
        message,
        itemsRemoved,
        errors
      };
      
    } catch (error) {
      console.error('Critical error during data cleanup:', error);
      return {
        success: false,
        message: 'Critical failure during cleanup operation',
        itemsRemoved,
        errors: [...errors, `Critical error: ${error}`]
      };
    }
  }
  
  /**
   * Get comprehensive data statistics
   */
  static getDataStats(): {
    userAccounts: number;
    searchHistoryItems: number;
    notificationItems: number;
    totalDataItems: number;
    allKeys: string[];
    userDataKeys: string[];
  } {
    try {
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('desiDestinations_user_'));
      const userDataKeys = allKeys.filter(key => 
        key.startsWith('desiDestinations') ||
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('auth')
      );
      
      const searchHistory = localStorage.getItem('searchHistory');
      const notifications = localStorage.getItem('notifications');
      
      let searchHistoryItems = 0;
      let notificationItems = 0;
      
      try {
        searchHistoryItems = searchHistory ? JSON.parse(searchHistory).length : 0;
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
      
      try {
        notificationItems = notifications ? JSON.parse(notifications).length : 0;
      } catch (error) {
        console.error('Error parsing notifications:', error);
      }
      
      return {
        userAccounts: userKeys.length,
        searchHistoryItems,
        notificationItems,
        totalDataItems: userDataKeys.length,
        allKeys,
        userDataKeys
      };
    } catch (error) {
      console.error('Error getting data stats:', error);
      return {
        userAccounts: 0,
        searchHistoryItems: 0,
        notificationItems: 0,
        totalDataItems: 0,
        allKeys: [],
        userDataKeys: []
      };
    }
  }
  
  /**
   * Force complete reset - nuclear option
   */
  static forceCompleteReset(): void {
    try {
      console.log('Starting force complete reset...');
      
      // Get all keys before clearing
      const allKeys = Object.keys(localStorage);
      console.log('All localStorage keys before reset:', allKeys);
      
      // Clear everything
      localStorage.clear();
      console.log('localStorage cleared completely');
      
      // Verify it's empty
      const remainingKeys = Object.keys(localStorage);
      console.log('Remaining keys after clear:', remainingKeys);
      
      // Force page reload to reset React state
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Error during force reset:', error);
      // Fallback: try to reload anyway
      window.location.reload();
    }
  }
  
  /**
   * Reset app to initial state (clean data + reload)
   */
  static resetAppState(): void {
    console.log('Resetting app state...');
    
    // Clean all data first
    const result = this.cleanAllUserData();
    console.log('Cleanup result:', result);
    
    // Force page reload to reset React state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  
  /**
   * Verify database is clean
   */
  static verifyCleanDatabase(): {
    isClean: boolean;
    remainingItems: string[];
    message: string;
  } {
    try {
      const stats = this.getDataStats();
      const isClean = stats.totalDataItems === 0;
      
      return {
        isClean,
        remainingItems: stats.userDataKeys,
        message: isClean 
          ? 'Database is completely clean' 
          : `Database still contains ${stats.totalDataItems} items`
      };
    } catch (error) {
      return {
        isClean: false,
        remainingItems: [],
        message: `Verification failed: ${error}`
      };
    }
  }
}