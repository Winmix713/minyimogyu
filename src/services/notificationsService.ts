import { httpClient, unwrapResponse } from './api';
import { Notification, NotificationFilters } from '@/types/notification';
import { mockNotifications } from './mockData';

// In-memory mock storage
let notificationsData = [...mockNotifications];

export const notificationsService = {
  getNotifications: async (filters?: NotificationFilters): Promise<Notification[]> => {
    let filtered = [...notificationsData];

    if (filters?.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    if (filters?.read !== undefined) {
      filtered = filtered.filter(n => n.read === filters.read);
    }

    if (filters?.priority) {
      filtered = filtered.filter(n => n.priority === filters.priority);
    }

    // Sort by creation date, newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const response = await httpClient.get<Notification[]>('/notifications', filtered);
    return unwrapResponse(response);
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    const notification = notificationsData.find(n => n.id === id);
    
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    const response = await httpClient.get<Notification>(`/notifications/${id}`, notification);
    return unwrapResponse(response);
  },

  addNotification: async (data: Partial<Notification>): Promise<Notification> => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: data.type || 'info',
      priority: data.priority || 'normal',
      title: data.title || '',
      message: data.message || '',
      read: false,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      metadata: data.metadata,
    };

    notificationsData.unshift(newNotification);

    const response = await httpClient.post<Notification>('/notifications', data, newNotification);
    return unwrapResponse(response);
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const index = notificationsData.findIndex(n => n.id === id);
    
    if (index === -1) {
      throw new Error(`Notification with id ${id} not found`);
    }

    notificationsData[index].read = true;

    const response = await httpClient.patch<Notification>(
      `/notifications/${id}/read`,
      {},
      notificationsData[index]
    );
    return unwrapResponse(response);
  },

  markAllAsRead: async (): Promise<void> => {
    notificationsData = notificationsData.map(n => ({ ...n, read: true }));

    await httpClient.post<void>('/notifications/mark-all-read', {}, undefined);
  },

  dismissNotification: async (id: string): Promise<void> => {
    const index = notificationsData.findIndex(n => n.id === id);
    
    if (index === -1) {
      throw new Error(`Notification with id ${id} not found`);
    }

    notificationsData.splice(index, 1);

    await httpClient.delete<void>(`/notifications/${id}`, undefined);
  },

  getUnreadCount: async (): Promise<number> => {
    const unreadCount = notificationsData.filter(n => !n.read).length;
    
    const response = await httpClient.get<{ count: number }>('/notifications/unread-count', { count: unreadCount });
    return unwrapResponse(response).count;
  },
};
