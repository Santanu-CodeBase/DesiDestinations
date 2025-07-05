import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SimpleReset from './components/SimpleReset';
import DestinationSearch from './components/DestinationSearch';
import SearchHistory from './components/SearchHistory';
import NotificationCenter from './components/NotificationCenter';
import BookingLinks from './components/BookingLinks';
import VoiceNotes from './components/VoiceNotes';
import AdminPanel from './components/admin/AdminPanel';
import AppHeader from './components/AppHeader';
import AppSidebar from './components/AppSidebar';
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
      <AppHeader
        userEmail={userEmail}
        isAdmin={isAdmin}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onShowAdminPanel={() => setShowAdminPanel(true)}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* Sidebar Navigation */}
        <AppSidebar
          activeTab={activeTab}
          sidebarCollapsed={sidebarCollapsed}
          unreadCount={unreadCount}
          isAdmin={isAdmin}
          onTabChange={setActiveTab}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onShowAdminPanel={() => setShowAdminPanel(true)}
        />

        {/* Overlay for mobile */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
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