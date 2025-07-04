import React, { useState } from 'react';
import { Bell, Inbox, Send, Clock, Check } from 'lucide-react';
import Logo from './Logo';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkAsRead }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'outbox'>('inbox');

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'search_complete':
        return '🔍';
      case 'booking_reminder':
        return '✈️';
      default:
        return '📱';
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Bell className="h-6 w-6 text-orange-600 mr-2" />
          Notifications
        </h2>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'inbox'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Inbox className="h-4 w-4" />
              <span>Inbox</span>
              {unreadNotifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'outbox'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Outbox</span>
              <span className="text-xs text-gray-500">({readNotifications.length})</span>
            </div>
          </button>
        </div>

        {/* Inbox */}
        {activeTab === 'inbox' && (
          <div className="space-y-3">
            {unreadNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No new notifications</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              unreadNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Outbox */}
        {activeTab === 'outbox' && (
          <div className="space-y-3">
            {readNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No read notifications</p>
              </div>
            ) : (
              readNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl opacity-60">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-gray-600">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-500">
                          Read {formatNotificationTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;