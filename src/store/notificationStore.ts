import { create } from 'zustand';
import { Notification } from '../types';
import { mockNotifications } from '../data/mockData';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const userNotifications = mockNotifications.filter(n => n.userId === userId);
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    set({ 
      notifications: userNotifications,
      unreadCount 
    });
  },
  
  markAsRead: (notificationId) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    
    set({ 
      notifications: updatedNotifications,
      unreadCount 
    });
  },
  
  markAllAsRead: (userId) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    );
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: 0 
    });
  },
  
  addNotification: (notificationData) => {
    const { notifications } = get();
    
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    set({ 
      notifications: [newNotification, ...notifications],
      unreadCount: get().unreadCount + 1
    });
  }
}));