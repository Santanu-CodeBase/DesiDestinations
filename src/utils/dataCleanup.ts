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
      
      // Remove ALL localStorage data (complete reset)
      allKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          itemsRemoved.push(key);
          console.log('Removed key:', key);
        } catch (error) {
          errors.push(`Failed to remove ${key}: ${error}`);
        }
      });
      
      // Double-check by clearing everything
      try {
        localStorage.clear();
        console.log('localStorage.clear() executed');
      } catch (error) {
        errors.push(`Failed to clear localStorage: ${error}`);
      }
      
      // Verify cleanup was successful
      const finalKeys = Object.keys(localStorage);
      console.log('Cleanup complete. Remaining keys:', finalKeys);
      
      if (finalKeys.length > 0) {
        errors.push(`Warning: ${finalKeys.length} keys still remain: ${finalKeys.join(', ')}`);
      }
      
      const success = finalKeys.length === 0;
      const message = success 
        ? `Successfully cleaned all data. Database is now completely empty.`
        : `Cleaned ${itemsRemoved.length} items but ${finalKeys.length} items remain.`;
      
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
        totalDataItems: allKeys.length, // Count ALL items, not just user data
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
      
      // Clear everything multiple times to ensure it's gone
      localStorage.clear();
      
      // Remove each key individually as backup
      allKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing key ${key}:`, error);
        }
      });
      
      // Clear again
      localStorage.clear();
      
      console.log('localStorage cleared completely');
      
      // Verify it's empty
      const remainingKeys = Object.keys(localStorage);
      console.log('Remaining keys after clear:', remainingKeys);
      
      // Force page reload to reset React state
      setTimeout(() => {
        console.log('Reloading page to reset app state...');
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
      console.log('Reloading app after cleanup...');
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
      const allKeys = Object.keys(localStorage);
      const isClean = allKeys.length === 0;
      
      return {
        isClean,
        remainingItems: allKeys,
        message: isClean 
          ? 'Database is completely clean - no data exists' 
          : `Database contains ${allKeys.length} items: ${allKeys.join(', ')}`
      };
    } catch (error) {
      return {
        isClean: false,
        remainingItems: [],
        message: `Verification failed: ${error}`
      };
    }
  }
  
  /**
   * Check if any user can currently login
   */
  static canAnyUserLogin(): {
    canLogin: boolean;
    userCount: number;
    currentSession: string | null;
    message: string;
  } {
    try {
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('desiDestinations_user_'));
      const currentSession = localStorage.getItem('desiDestinationsEmail');
      
      const canLogin = userKeys.length > 0;
      
      return {
        canLogin,
        userCount: userKeys.length,
        currentSession,
        message: canLogin 
          ? `${userKeys.length} users can still login` 
          : 'No users can login - database is clean'
      };
    } catch (error) {
      return {
        canLogin: false,
        userCount: 0,
        currentSession: null,
        message: `Check failed: ${error}`
      };
    }
  }
}