import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { DataCleanup } from '../../utils/dataCleanup';

const DataCleanupPanel: React.FC = () => {
  const [stats, setStats] = useState({
    userAccounts: 0,
    searchHistoryItems: 0,
    notificationItems: 0,
    totalDataItems: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<{
    success: boolean;
    message: string;
    itemsRemoved: string[];
  } | null>(null);

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const currentStats = DataCleanup.getDataStats();
    setStats(currentStats);
  };

  const handleCleanup = async () => {
    if (!window.confirm('⚠️ This will permanently delete ALL user data. Are you sure?')) {
      return;
    }

    setIsLoading(true);
    
    // Simulate processing time for user feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = DataCleanup.cleanAllUserData();
    setLastCleanup(result);
    
    // Refresh stats after cleanup
    refreshStats();
    setIsLoading(false);
    
    if (result.success) {
      // Auto-reload after successful cleanup
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleResetApp = () => {
    if (!window.confirm('⚠️ This will clean all data and restart the app. Continue?')) {
      return;
    }
    
    DataCleanup.resetAppState();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Database className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Database Cleanup</h2>
          <p className="text-sm text-gray-600">Remove all user data while preserving app structure</p>
        </div>
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
            <div className="text-sm text-gray-600">
              <strong>Removed items:</strong> {lastCleanup.itemsRemoved.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={refreshStats}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Stats</span>
        </button>

        <button
          onClick={handleCleanup}
          disabled={isLoading || stats.totalDataItems === 0}
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
              <span>Clean All Data</span>
            </>
          )}
        </button>

        <button
          onClick={handleResetApp}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset App</span>
        </button>
      </div>

      {/* Warning Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Warning:</strong> This action permanently removes all user accounts, search history, 
            and notifications. The database schema and app functionality will remain intact.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleanupPanel;