import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Database, AlertTriangle, CheckCircle, Zap, Eye, Users, LogOut } from 'lucide-react';
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
  const [loginStatus, setLoginStatus] = useState({
    canLogin: false,
    userCount: 0,
    currentSession: null as string | null,
    message: ''
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
    const currentLoginStatus = DataCleanup.canAnyUserLogin();
    setStats(currentStats);
    setLoginStatus(currentLoginStatus);
    console.log('Current stats:', currentStats);
    console.log('Login status:', currentLoginStatus);
  };

  const handleCleanup = async () => {
    if (!window.confirm('⚠️ This will permanently delete ALL data including user accounts. No one will be able to login after this. Are you sure?')) {
      return;
    }

    setIsLoading(true);
    setLastCleanup(null);
    
    // Show immediate feedback
    console.log('Starting complete cleanup process...');
    
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
      const loginCheck = DataCleanup.canAnyUserLogin();
      console.log('Verification result:', verification);
      console.log('Login check result:', loginCheck);
      
      if (result.success && verification.isClean && !loginCheck.canLogin) {
        // Auto-reload after successful cleanup
        setTimeout(() => {
          console.log('Complete cleanup successful, reloading app...');
          window.location.reload();
        }, 2000);
      }
    }, 500);
  };

  const handleForceReset = () => {
    if (!window.confirm('🚨 NUCLEAR OPTION: This will completely wipe ALL data and restart the app. No users will be able to login. Continue?')) {
      return;
    }
    
    console.log('Initiating force reset...');
    DataCleanup.forceCompleteReset();
  };

  const handleResetApp = () => {
    if (!window.confirm('⚠️ This will clean all data and restart the app. No users will be able to login after this. Continue?')) {
      return;
    }
    
    console.log('Initiating app reset...');
    DataCleanup.resetAppState();
  };

  const handleVerifyDatabase = () => {
    const verification = DataCleanup.verifyCleanDatabase();
    const loginCheck = DataCleanup.canAnyUserLogin();
    console.log('Database verification:', verification);
    console.log('Login verification:', loginCheck);
    
    setLastCleanup({
      success: verification.isClean && !loginCheck.canLogin,
      message: `${verification.message}. ${loginCheck.message}`,
      itemsRemoved: verification.remainingItems,
      errors: verification.isClean && !loginCheck.canLogin ? [] : ['Database not completely clean or users can still login']
    });
    
    refreshStats();
  };

  const isDatabaseClean = stats.totalDataItems === 0 && !loginStatus.canLogin;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Database className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Database Reset</h2>
            <p className="text-sm text-gray-600">Remove ALL data to start with a clean slate</p>
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

      {/* Database Status Indicator */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg border-2 ${
          isDatabaseClean 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${
              isDatabaseClean ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <div>
              <div className={`font-semibold ${
                isDatabaseClean ? 'text-green-800' : 'text-red-800'
              }`}>
                {isDatabaseClean ? '✅ Database is Clean' : '❌ Database Contains Data'}
              </div>
              <div className={`text-sm ${
                isDatabaseClean ? 'text-green-700' : 'text-red-700'
              }`}>
                {isDatabaseClean 
                  ? 'No users can login. Ready for fresh start.' 
                  : `${loginStatus.userCount} users can still login. Cleanup needed.`
                }
              </div>
            </div>
          </div>
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

      {/* Login Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Authentication Status</span>
        </div>
        <div className="text-sm space-y-1">
          <div>Users who can login: <span className="font-medium">{loginStatus.userCount}</span></div>
          <div>Current session: <span className="font-medium">{loginStatus.currentSession || 'None'}</span></div>
          <div className={`font-medium ${loginStatus.canLogin ? 'text-red-600' : 'text-green-600'}`}>
            {loginStatus.message}
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Detailed Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>All localStorage keys ({stats.allKeys.length}):</strong>
              <div className="text-gray-600 mt-1 max-h-20 overflow-y-auto">
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
            <div className="text-sm text-gray-600 mb-2 max-h-20 overflow-y-auto">
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
              <span>Clean All</span>
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

      {/* Primary Action */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleResetApp}
          className="flex items-center justify-center space-x-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors text-lg"
        >
          <LogOut className="h-5 w-5" />
          <span>COMPLETE RESET & RESTART</span>
        </button>
      </div>

      {/* Warning Notice */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Critical Warning:</strong> These actions will permanently remove ALL user accounts, 
            making it impossible for anyone to login. The app will restart with a completely clean database. 
            Use "COMPLETE RESET & RESTART" for guaranteed clean slate.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleanupPanel;