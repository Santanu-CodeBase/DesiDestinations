import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Bell, History, Mic, Settings, Menu, X, ChevronLeft } from 'lucide-react';
import Logo from './components/Logo';
import LoginForm from './components/LoginForm';
import SimpleReset from './components/SimpleReset';
import DestinationSearch from './components/DestinationSearch';
import SearchHistory from './components/SearchHistory';
import NotificationCenter from './components/NotificationCenter';
import BookingLinks from './components/BookingLinks';
import VoiceNotes from './components/VoiceNotes';
import AdminPanel from './components/admin/AdminPanel';
import { SearchRecord, NotificationItem } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [searchHistory, setSearchHistory] = useState<SearchRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedEmail = localStorage.getItem('desiDestinationsEmail');
    if (savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    }

    // Load search history and notifications
    const savedHistory = localStorage.getItem('searchHistory');
    const savedNotifications = localStorage.getItem('notifications');
    
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    if (savedNotifications) {
      const notifs = JSON.parse(savedNotifications);
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: NotificationItem) => !n.read).length);
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('desiDestinationsEmail', email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('desiDestinationsEmail');
  };

  const addSearchRecord = (search: Omit<SearchRecord, 'id' | 'timestamp'>) => {
    const newSearch: SearchRecord = {
      ...search,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newSearch, ...searchHistory].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

    // Add notification
    const notification: NotificationItem = {
      id: Date.now().toString(),
      message: `Search completed for ${search.destinations.join(', ')}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'search_complete'
    };

    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Check for admin access (simple check - in production use proper auth)
  const isAdmin = userEmail === 'admin@desidestinations.com';

  // Show reset panel if requested via URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      setShowReset(true);
    }
  }, []);

  if (showReset) {
    return <SimpleReset />;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (showAdminPanel && isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/95 backdrop-blur-md shadow-xl border-b-2 border-orange-500/30 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-orange-500/20 transition-colors lg:hidden"
              >
                {sidebarCollapsed ? <Menu className="h-5 w-5 text-orange-400" /> : <X className="h-5 w-5 text-orange-400" />}
              </button>
              <Logo size="md" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">DesiDestinations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Namaste, <span className="text-orange-400 font-medium">{userEmail.split('@')[0]}</span>!</span>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20 hover:border-cyan-400/30 transition-all"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 font-medium bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 hover:border-red-400/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className={`fixed lg:relative inset-y-0 left-0 z-20 bg-gray-800/95 backdrop-blur-md border-r border-gray-700/50 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64'
        } ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Sidebar Header */}
            <div className={`flex items-center justify-between p-4 border-b border-gray-700/50 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-gray-100">Navigation</h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg hover:bg-gray-700/50 transition-colors ${sidebarCollapsed ? 'lg:block hidden' : ''}`}
              >
                {sidebarCollapsed ? (
                  <Menu className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-3 py-4 space-y-2">
              {[
                { id: 'search', label: 'Search', icon: MapPin, description: 'Plan your journey' },
                { id: 'history', label: 'History', icon: History, description: 'View past searches' },
                { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Check updates' },
                { id: 'voice', label: 'Voice', icon: Mic, description: 'Voice search' }
              ].map(({ id, label, icon: Icon, description }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    if (window.innerWidth < 1024) {
                      setSidebarCollapsed(true);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 group relative ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 shadow-lg border border-orange-500/30'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                  }`}
                  title={sidebarCollapsed ? label : ''}
                >
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${activeTab === id ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    {id === 'notifications' && unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{label}</div>
                      <div className={`text-xs mt-0.5 ${activeTab === id ? 'text-orange-400/70' : 'text-gray-500'}`}>{description}</div>
                    </div>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900/95 backdrop-blur-md text-orange-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700/50 shadow-xl">
                      {label}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Admin Panel Link */}
            {isAdmin && (
              <div className="border-t border-gray-700/50 p-3">
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 group text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400/30 ${
                    sidebarCollapsed ? 'justify-center' : ''
                  }`}
                  title={sidebarCollapsed ? 'Admin Panel' : ''}
                >
                  <Settings className="h-5 w-5" />
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">Admin Panel</div>
                      <div className="text-xs text-cyan-400/70 mt-0.5">Manage system</div>
                    </div>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900/95 backdrop-blur-md text-cyan-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700/50 shadow-xl">
                      Admin Panel
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Overlay for mobile */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <DestinationSearch onSearchComplete={addSearchRecord} />
        )}
        {activeTab === 'history' && (
          <SearchHistory 
            searchHistory={searchHistory} 
            onModifySearch={addSearchRecord}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationCenter 
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
          />
        )}
        {activeTab === 'voice' && (
          <VoiceNotes onSearchComplete={addSearchRecord} />
        )}
          </div>
        </main>
      </div>

      {/* Booking Links Footer */}
      <BookingLinks />
    </div>
  );
}

export default App;