import { create } from 'zustand';
import { Notification, NotificationFilters } from '@/types/notification';
import { notificationsService } from '@/services/notificationsService';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

interface NotificationsActions {
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  addNotification: (data: Partial<Notification>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  clearError: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  // Actions
  fetchNotifications: async (filters?: NotificationFilters) => {
    set({ loading: true, error: null });
    
    try {
      const notifications = await notificationsService.getNotifications(filters);
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await notificationsService.getUnreadCount();
      set({ unreadCount });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  addNotification: async (data: Partial<Notification>) => {
    set({ loading: true, error: null });
    
    try {
      const newNotification = await notificationsService.addNotification(data);
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add notification';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      const updatedNotification = await notificationsService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? updatedNotification : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      set({ error: errorMessage });
      throw error;
    }
  },

  markAllAsRead: async () => {
    set({ loading: true, error: null });
    
    try {
      await notificationsService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  dismissNotification: async (id: string) => {
    try {
      await notificationsService.dismissNotification(id);
      set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.read;
        
        return {
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to dismiss notification';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks
export const useNotifications = () => useNotificationsStore((state) => ({
  notifications: state.notifications,
  unreadCount: state.unreadCount,
  loading: state.loading,
  error: state.error,
}));

export const useNotificationsLoading = () => useNotificationsStore((state) => state.loading);
export const useNotificationsError = () => useNotificationsStore((state) => state.error);
export const useUnreadCount = () => useNotificationsStore((state) => state.unreadCount);

export const useUnreadNotifications = () => {
  const notifications = useNotificationsStore((state) => state.notifications);
  return notifications.filter(n => !n.read);
};

export const useNotificationsByType = (type: Notification['type']) => {
  const notifications = useNotificationsStore((state) => state.notifications);
  return notifications.filter(n => n.type === type);
};

export const useNotificationsActions = () => useNotificationsStore((state) => ({
  fetchNotifications: state.fetchNotifications,
  fetchUnreadCount: state.fetchUnreadCount,
  addNotification: state.addNotification,
  markAsRead: state.markAsRead,
  markAllAsRead: state.markAllAsRead,
  dismissNotification: state.dismissNotification,
  clearError: state.clearError,
}));
