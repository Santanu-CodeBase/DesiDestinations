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
    <nav className={`fixed lg:relative inset-y-0 left-0 z-20 bg-gradient-to-b from-blue-900 to-blue-800 border-r border-blue-700 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out ${
      sidebarCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64'
    } ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
      <div className="flex flex-col h-full pt-16 lg:pt-0">
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b border-blue-700 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
          )}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg hover:bg-blue-700 transition-colors ${sidebarCollapsed ? 'lg:block hidden' : ''}`}
          >
            {sidebarCollapsed ? (
              <Menu className="h-5 w-5 text-white" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-white" />
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
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
              title={sidebarCollapsed ? label : ''}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${activeTab === id ? 'text-white' : 'text-blue-200 group-hover:text-white'}`} />
                {id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{label}</div>
                  <div className={`text-xs mt-0.5 ${activeTab === id ? 'text-blue-100' : 'text-blue-300'}`}>{description}</div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Admin Panel Link */}
        {isAdmin && (
          <div className="border-t border-blue-700 p-3">
            <button
              onClick={onShowAdminPanel}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 group text-blue-200 hover:bg-blue-700 hover:text-white ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Admin Panel' : ''}
            >
              <Settings className="h-5 w-5 text-blue-200 group-hover:text-white" />
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">Admin Panel</div>
                  <div className="text-xs text-blue-300 group-hover:text-blue-100 mt-0.5">Manage system</div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
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