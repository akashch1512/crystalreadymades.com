import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Notifications | CrystalReadymade';
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes < 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="page">
        <div className="section">
          <div className="container mx-auto">
            <h1 className="h1 mb-6">Notifications</h1>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card p-6">
                  <div className="flex">
                    <div className="w-10 h-10 bg-surface-muted rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-surface-muted rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-surface-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-surface-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section">
        <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center text-brand hover:text-brand-strong text-sm font-medium"
          >
            <Check size={16} className="mr-1" />
            Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`card p-6 border-l-4 ${
                notification.read
                  ? 'border-line'
                  : notification.type === 'order'
                  ? 'border-brand'
                  : notification.type === 'promotion'
                  ? 'border-purple-500'
                  : 'border-line'
              }`}
            >
              <div className="flex">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    notification.type === 'order'
                      ? 'bg-brand/10 text-brand'
                      : notification.type === 'promotion'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-surface-muted text-muted'
                  }`}
                >
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${notification.read ? 'text-muted' : 'text-text'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-sm text-muted">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className={`mt-1 ${notification.read ? 'text-muted' : 'text-muted'}`}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="mt-2 text-sm text-brand hover:text-brand-strong"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-muted rounded-2xl border border-line">
          <div className="flex justify-center mb-4">
            <Bell size={48} className="text-muted" />
          </div>
          <h2 className="h3 mb-2">No notifications</h2>
          <p className="text-muted">
            You don't have any notifications right now. We'll let you know when there's any update.
          </p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
