import React, { createContext, useState, useContext, useEffect } from 'react';
import { Notification } from '../types';
import { getNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const loadNotifications = async () => {
        try {
          const notifs = await getNotifications(user.id);
          setUserNotifications(notifs);
        } catch (error) {
          console.error('Failed to load notifications:', error);
          setUserNotifications([]);
        } finally {
          setLoading(false);
        }
      };
      loadNotifications();
    } else {
      setUserNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const unreadCount = userNotifications.filter(notif => !notif.read).length;

  const markAsRead = (id: string) => {
    setUserNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setUserNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    setUserNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications: userNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};