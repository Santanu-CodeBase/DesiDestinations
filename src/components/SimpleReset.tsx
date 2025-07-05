import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

const SimpleReset: React.FC = () => {
  const handleCompleteReset = () => {
    // Step 1: Clear ALL browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Step 2: Remove any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Step 3: Force reload the page to reset everything
    window.location.reload();
  };

  const checkDataStatus = () => {
    const allKeys = Object.keys(localStorage);
    const hasData = allKeys.length > 0;
    
    return {
      hasData,
      keyCount: allKeys.length,
      keys: allKeys
    };
  };

  const status = checkDataStatus();

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Application</h1>
          <p className="text-gray-600">Remove all user data and start fresh</p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700">
            <div className="mb-2">
              <strong>Current Status:</strong> {status.hasData ? '❌ Data exists' : '✅ Clean'}
            </div>
            <div>
              <strong>Data items:</strong> {status.keyCount}
            </div>
          </div>
        </div>

        <button
          onClick={handleCompleteReset}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>RESET EVERYTHING NOW</span>
        </button>

        <p className="text-xs text-gray-500 mt-4">
          This will delete all data and reload the app
        </p>
      </div>
    </div>
  );
};

export default SimpleReset;