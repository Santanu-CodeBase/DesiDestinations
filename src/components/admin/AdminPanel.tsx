import React, { useState } from 'react';
import { Settings, Shield, Database } from 'lucide-react';
import DataCleanupPanel from './DataCleanupPanel';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cleanup' | 'settings'>('cleanup');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage application data and settings</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 border border-gray-200">
          <div className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('cleanup')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'cleanup'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Data Cleanup</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'cleanup' && <DataCleanupPanel />}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Application Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;