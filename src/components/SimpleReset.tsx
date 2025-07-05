import React from 'react';
import { Trash2, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import { DataCleanup } from '../utils/dataCleanup';

const SimpleReset: React.FC = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [status, setStatus] = React.useState<{
    hasData: boolean;
    keyCount: number;
    keys: string[];
  } | null>(null);

  React.useEffect(() => {
    checkDataStatus();
  }, []);

  const checkDataStatus = () => {
    const allKeys = Object.keys(localStorage);
    const sessionKeys = Object.keys(sessionStorage);
    const totalKeys = [...allKeys, ...sessionKeys];
    const hasData = totalKeys.length > 0;
    
    setStatus({
      hasData,
      keyCount: totalKeys.length,
      keys: totalKeys
    });
  };

  const handleCompleteReset = async () => {
    setIsProcessing(true);
    
    try {
      console.log('Starting complete reset process...');
      
      // Step 1: Clear ALL browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Step 2: Remove any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      }
      
      // Step 3: Clear IndexedDB if available
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          await Promise.all(
            databases.map(db => {
              if (db.name) {
                return new Promise((resolve, reject) => {
                  const deleteReq = indexedDB.deleteDatabase(db.name!);
                  deleteReq.onsuccess = () => resolve(undefined);
                  deleteReq.onerror = () => reject(deleteReq.error);
                });
              }
            })
          );
        } catch (error) {
          console.warn('Could not clear IndexedDB:', error);
        }
      }
      
      // Step 4: Clear cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
      
      console.log('All data cleared successfully');
      
      // Step 5: Force reload the page to reset everything
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      
    } catch (error) {
      console.error('Reset failed:', error);
      // Fallback: force reload anyway
      window.location.reload();
    }
  };

  const handleEmergencyReset = () => {
    if (window.confirm('🚨 EMERGENCY RESET: This will immediately clear ALL data and restart the app. Continue?')) {
      DataCleanup.emergencyCleanup();
    }
  };

  const handleDataCleanupReset = () => {
    if (window.confirm('⚠️ This will use the data cleanup utility to remove all user data. Continue?')) {
      setIsProcessing(true);
      DataCleanup.forceCompleteReset();
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Application</h1>
          <p className="text-gray-600">Remove all user data and start with a fresh slate</p>
        </div>

        {status && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <strong>Current Status:</strong> 
                <span className={status.hasData ? 'text-red-600' : 'text-green-600'}>
                  {status.hasData ? '❌ Data exists' : '✅ Clean'}
                </span>
              </div>
              <div className="flex justify-between">
                <strong>Data items:</strong> 
                <span>{status.keyCount}</span>
              </div>
              {status.hasData && status.keys.length > 0 && (
                <div className="mt-2">
                  <strong>Keys found:</strong>
                  <div className="text-xs text-gray-500 mt-1 max-h-20 overflow-y-auto">
                    {status.keys.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <button
            onClick={handleCompleteReset}
            disabled={isProcessing}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                <span>COMPLETE RESET</span>
              </>
            )}
          </button>

          <button
            onClick={handleDataCleanupReset}
            disabled={isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5" />
            <span>Data Cleanup Reset</span>
          </button>

          <button
            onClick={handleEmergencyReset}
            disabled={isProcessing}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Zap className="h-5 w-5" />
            <span>EMERGENCY RESET</span>
          </button>

          <button
            onClick={checkDataStatus}
            disabled={isProcessing}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Check Status</span>
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-800">
                <strong>Warning:</strong> These actions will permanently remove ALL user accounts, 
                search history, notifications, and app data. No one will be able to login after this.
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Complete Reset:</strong> Clears localStorage, sessionStorage, caches, IndexedDB, and cookies</p>
            <p><strong>Data Cleanup Reset:</strong> Uses the app's data cleanup utility</p>
            <p><strong>Emergency Reset:</strong> Nuclear option - clears everything immediately</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimpleReset;