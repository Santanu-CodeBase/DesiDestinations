import React from 'react';
import { MapPin, History, Bell, Mic, Settings, Menu, ChevronLeft } from 'lucide-react';

interface AppSidebarProps {
  activeTab: string;
  sidebarCollapsed: boolean;
  unreadCount: number;
  isAdmin: boolean;
  onTabChange: (tab: string) => void;
  onToggleSidebar: () => void;
  onShowAdminPanel: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  sidebarCollapsed,
  unreadCount,
  isAdmin,
  onTabChange,
  onToggleSidebar,
  onShowAdminPanel
}) => {
  const navigationItems = [
    { id: 'search', label: 'Search', icon: MapPin, description: 'Plan your journey' },
    { id: 'history', label: 'History', icon: History, description: 'View past searches' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Check updates' },
    { id: 'voice', label: 'Voice', icon: Mic, description: 'Voice search' }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (window.innerWidth < 1024) {
      onToggleSidebar();
    }
  };

  return (
    <nav className={`fixed lg:relative inset-y-0 left-0 z-20 bg-white border-r border-gray-200 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out ${
      sidebarCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64'
    } ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
      <div className="flex flex-col h-full pt-16 lg:pt-0">
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          )}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${sidebarCollapsed ? 'lg:block hidden' : ''}`}
          >
            {sidebarCollapsed ? (
              <Menu className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-2">
          {navigationItems.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 group relative ${
                activeTab === id
                  ? 'bg-orange-100 text-orange-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={sidebarCollapsed ? label : ''}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${activeTab === id ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                {id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{description}</div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Admin Panel Link */}
        {isAdmin && (
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={onShowAdminPanel}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 group text-indigo-600 hover:bg-indigo-50 ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Admin Panel' : ''}
            >
              <Settings className="h-5 w-5" />
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">Admin Panel</div>
                  <div className="text-xs text-indigo-500 mt-0.5">Manage system</div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Admin Panel
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppSidebar;