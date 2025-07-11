import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Bell, History, Mic, Settings } from 'lucide-react';
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
              <Logo size="md" />
              <h1 className="text-2xl font-bold text-gray-900">DesiDestinations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Namaste, {userEmail.split('@')[0]}!</span>
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

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'search', label: 'Search', icon: MapPin },
              { id: 'history', label: 'History', icon: History },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'voice', label: 'Voice', icon: Mic }
            ].map(({ id, label, icon: Icon }) => (
              <div key={id} className="relative">
              <button
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {id === 'notifications' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              </div>
            ))}
            {showAdminPanel && isAdmin && (
              <button
                onClick={() => setShowAdminPanel(false)}
                className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              >
                <span>← Back to App</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>

      {/* Booking Links Footer */}
      <BookingLinks />
    </div>
  );
}

export default App;