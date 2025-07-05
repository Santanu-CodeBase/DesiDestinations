import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Database, AlertTriangle, CheckCircle, Zap, Eye } from 'lucide-react';
import { DataCleanup } from '../../utils/dataCleanup';

const DataCleanupPanel: React.FC = () => {
  const [stats, setStats] = useState({
    userAccounts: 0,
    searchHistoryItems: 0,
    notificationItems: 0,
    totalDataItems: 0,
    allKeys: [] as string[],
    userDataKeys: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<{
    success: boolean;
    message: string;
    itemsRemoved: string[];
    errors?: string[];
  } | null>(null);

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const currentStats = DataCleanup.getDataStats();
    setStats(currentStats);
    console.log('Current stats:', currentStats);
  };

  const handleCleanup = async () => {
    if (!window.confirm('⚠️ This will permanently delete ALL user data. Are you sure?')) {
      return;
    }

    setIsLoading(true);
    setLastCleanup(null);
    
    // Show immediate feedback
    console.log('Starting cleanup process...');
    
    // Simulate processing time for user feedback
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = DataCleanup.cleanAllUserData();
    console.log('Cleanup result:', result);
    setLastCleanup(result);
    
    // Refresh stats after cleanup
    setTimeout(() => {
      refreshStats();
      setIsLoading(false);
      
      // Verify cleanup was successful
      const verification = DataCleanup.verifyCleanDatabase();
      console.log('Verification result:', verification);
      
      if (result.success && verification.isClean) {
        // Auto-reload after successful cleanup
        setTimeout(() => {
          console.log('Cleanup successful, reloading app...');
          window.location.reload();
        }, 2000);
      }
    }, 500);
  };

  const handleForceReset = () => {
    if (!window.confirm('🚨 NUCLEAR OPTION: This will clear ALL localStorage data and restart the app. Continue?')) {
      return;
    }
    
    console.log('Initiating force reset...');
    DataCleanup.forceCompleteReset();
  };

  const handleResetApp = () => {
    if (!window.confirm('⚠️ This will clean all data and restart the app. Continue?')) {
      return;
    }
    
    console.log('Initiating app reset...');
    DataCleanup.resetAppState();
  };

  const handleVerifyDatabase = () => {
    const verification = DataCleanup.verifyCleanDatabase();
    console.log('Database verification:', verification);
    
    setLastCleanup({
      success: verification.isClean,
      message: verification.message,
      itemsRemoved: verification.remainingItems,
      errors: verification.isClean ? [] : ['Database not completely clean']
    });
    
    refreshStats();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Database className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Database Cleanup</h2>
            <p className="text-sm text-gray-600">Remove all user data while preserving app structure</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <Eye className="h-4 w-4" />
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
        </button>
      </div>

      {/* Current Data Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.userAccounts}</div>
          <div className="text-sm text-blue-700">User Accounts</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.searchHistoryItems}</div>
          <div className="text-sm text-green-700">Search Records</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.notificationItems}</div>
          <div className="text-sm text-yellow-700">Notifications</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalDataItems}</div>
          <div className="text-sm text-purple-700">Total Items</div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Detailed Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>All localStorage keys ({stats.allKeys.length}):</strong>
              <div className="text-gray-600 mt-1">
                {stats.allKeys.length > 0 ? stats.allKeys.join(', ') : 'None'}
              </div>
            </div>
            <div>
              <strong>User data keys ({stats.userDataKeys.length}):</strong>
              <div className="text-gray-600 mt-1">
                {stats.userDataKeys.length > 0 ? stats.userDataKeys.join(', ') : 'None'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cleanup Results */}
      {lastCleanup && (
        <div className={`p-4 rounded-lg mb-6 ${
          lastCleanup.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {lastCleanup.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${
              lastCleanup.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastCleanup.message}
            </span>
          </div>
          {lastCleanup.itemsRemoved.length > 0 && (
            <div className="text-sm text-gray-600 mb-2">
              <strong>Items processed:</strong> {lastCleanup.itemsRemoved.join(', ')}
            </div>
          )}
          {lastCleanup.errors && lastCleanup.errors.length > 0 && (
            <div className="text-sm text-red-600">
              <strong>Errors:</strong> {lastCleanup.errors.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <button
          onClick={refreshStats}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>

        <button
          onClick={handleVerifyDatabase}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Verify</span>
        </button>

        <button
          onClick={handleCleanup}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Cleaning...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span>Clean Data</span>
            </>
          )}
        </button>

        <button
          onClick={handleForceReset}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium transition-colors"
        >
          <Zap className="h-4 w-4" />
          <span>Force Reset</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex justify-center">
        <button
          onClick={handleResetApp}
          className="flex items-center justify-center space-x-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Clean & Restart App</span>
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 text-center">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
          stats.totalDataItems === 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            stats.totalDataItems === 0 ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          <span>
            {stats.totalDataItems === 0 
              ? 'Database is clean and ready' 
              : `${stats.totalDataItems} items need cleanup`
            }
          </span>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Warning:</strong> These actions permanently remove all user accounts, search history, 
            and notifications. The database schema and app functionality will remain intact. Use "Force Reset" 
            only if normal cleanup fails.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleanupPanel;