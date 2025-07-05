import React from 'react';
import { Settings, Menu, X } from 'lucide-react';
import Logo from './Logo';

interface AppHeaderProps {
  userEmail: string;
  isAdmin: boolean;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onShowAdminPanel: () => void;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  userEmail,
  isAdmin,
  sidebarCollapsed,
  onToggleSidebar,
  onShowAdminPanel,
  onLogout
}) => {
  return (
    <header className="bg-white shadow-sm border-b-2 border-orange-200 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-orange-50 transition-colors lg:hidden"
            >
              {sidebarCollapsed ? <Menu className="h-5 w-5 text-gray-600" /> : <X className="h-5 w-5 text-gray-600" />}
            </button>
            <Logo size="md" />
            <h1 className="text-2xl font-bold text-gray-900">DesiDestinations</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Namaste, {userEmail.split('@')[0]}!</span>
            {isAdmin && (
              <button
                onClick={onShowAdminPanel}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;