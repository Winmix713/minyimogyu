import { useEffect } from 'react';
import { useNotifications, useNotificationsActions } from '@/store/notificationsStore';
import { NotificationFilters } from '@/types/notification';

interface UseNotificationsOptions {
  autoFetch?: boolean;
  filters?: NotificationFilters;
  refetchInterval?: number;
}

export const useStoreNotifications = (options: UseNotificationsOptions = {}) => {
  const { autoFetch = true, filters, refetchInterval } = options;
  const { notifications, unreadCount, loading, error } = useNotifications();
  const actions = useNotificationsActions();

  useEffect(() => {
    if (autoFetch) {
      actions.fetchNotifications(filters);
    }
  }, [autoFetch, JSON.stringify(filters)]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        actions.fetchNotifications(filters);
        actions.fetchUnreadCount();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, JSON.stringify(filters)]);

  const refetch = () => {
    actions.fetchNotifications(filters);
    actions.fetchUnreadCount();
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch,
    add: actions.addNotification,
    dismiss: actions.dismissNotification,
    markAsRead: actions.markAsRead,
    markAllAsRead: actions.markAllAsRead,
    clearError: actions.clearError,
  };
};
