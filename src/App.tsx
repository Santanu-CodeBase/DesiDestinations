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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors lg:hidden"
              >
                {sidebarCollapsed ? <Menu className="h-5 w-5 text-orange-600" /> : <X className="h-5 w-5 text-orange-600" />}
              </button>
              <Logo size="md" />
              <h1 className="text-2xl font-bold text-gray-900">DesiDestinations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Namaste, <span className="text-orange-600 font-medium">{userEmail.split('@')[0]}</span>!</span>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
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
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${sidebarCollapsed ? 'lg:block hidden' : ''}`}
              >
                {sidebarCollapsed ? (
                  <Menu className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-500" />
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
                      ? 'text-orange-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  title={sidebarCollapsed ? label : ''}
                >
                  <div className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                    activeTab === id 
                      ? 'bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className={`h-6 w-6 ${activeTab === id ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    {id === 'notifications' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{label}</div>
                      <div className={`text-xs mt-0.5 ${activeTab === id ? 'text-orange-500' : 'text-gray-400'}`}>{description}</div>
                    </div>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
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
                  onClick={() => setShowAdminPanel(true)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 group text-indigo-600 hover:bg-indigo-50 ${
                    sidebarCollapsed ? 'justify-center' : ''
                  }`}
                  title={sidebarCollapsed ? 'Admin Panel' : ''}
                >
                  <div className="relative p-2.5 rounded-xl bg-indigo-100 transition-all duration-200 group-hover:bg-indigo-200 shadow-lg">
                    <Settings className="h-6 w-6 text-indigo-600" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">Admin Panel</div>
                      <div className="text-xs text-indigo-500 mt-0.5">Manage system</div>
                    </div>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
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
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
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