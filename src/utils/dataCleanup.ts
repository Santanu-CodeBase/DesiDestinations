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
      
      // Also clear sessionStorage for complete cleanup
      try {
        sessionStorage.clear();
        console.log('sessionStorage.clear() executed');
      } catch (error) {
        errors.push(`Failed to clear sessionStorage: ${error}`);
      }
      
      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
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
        key.toLowerCase().includes('auth') ||
        key.includes('searchHistory') ||
        key.includes('notifications')
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
      const sessionKeys = Object.keys(sessionStorage);
      console.log('All localStorage keys before reset:', allKeys);
      console.log('All sessionStorage keys before reset:', sessionKeys);
      
      // Clear everything multiple times to ensure it's gone
      localStorage.clear();
      sessionStorage.clear();
      
      // Remove each key individually as backup
      allKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing localStorage key ${key}:`, error);
        }
      });
      
      sessionKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing sessionStorage key ${key}:`, error);
        }
      });
      
      // Clear again
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('All storage cleared completely');
      
      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Verify it's empty
      const remainingLocalKeys = Object.keys(localStorage);
      const remainingSessionKeys = Object.keys(sessionStorage);
      console.log('Remaining localStorage keys after clear:', remainingLocalKeys);
      console.log('Remaining sessionStorage keys after clear:', remainingSessionKeys);
      
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
      const sessionKeys = Object.keys(sessionStorage);
      const totalKeys = [...allKeys, ...sessionKeys];
      const isClean = totalKeys.length === 0;
      
      return {
        isClean,
        remainingItems: totalKeys,
        message: isClean 
          ? 'Database is completely clean - no data exists' 
          : `Database contains ${totalKeys.length} items: ${totalKeys.join(', ')}`
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

  /**
   * Emergency cleanup - removes all data and forces app restart
   */
  static emergencyCleanup(): void {
    try {
      console.log('EMERGENCY CLEANUP INITIATED');
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB if available
      if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        }).catch(console.error);
      }
      
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        }).catch(console.error);
      }
      
      // Clear cookies (if possible)
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      console.log('Emergency cleanup completed - forcing reload');
      
      // Force immediate reload
      window.location.href = window.location.origin;
      
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
      // Last resort - force reload anyway
      window.location.reload();
    }
  }
}