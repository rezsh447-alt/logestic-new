import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationType } from '@/lib/types';
import { ForwardApi } from '@/lib/api/forward-api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export function useNotifications(driverId: string) {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  });

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      data?: Record<string, any>
    ) => {
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        driverId,
        type,
        title,
        message,
        data,
        read: false,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        notifications: [notification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1,
      }));

      return notification;
    },
    [driverId]
  );

  const markAsRead = useCallback((notificationId: string) => {
    setState((prev) => {
      const updated = prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );

      const wasUnread = prev.notifications.find((n) => n.id === notificationId)?.read === false;

      return {
        ...prev,
        notifications: updated,
        unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
      };
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setState((prev) => {
      const notification = prev.notifications.find((n) => n.id === notificationId);
      const wasUnread = notification?.read === false;

      return {
        ...prev,
        notifications: prev.notifications.filter((n) => n.id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: [],
      unreadCount: 0,
    }));
  }, []);

  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return state.notifications.filter((n) => n.type === type);
    },
    [state.notifications]
  );

  const getUnreadNotifications = useCallback(() => {
    return state.notifications.filter((n) => !n.read);
  }, [state.notifications]);

  const fetchNotifications = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await ForwardApi.getNotifications();
      const mappedNotifications: Notification[] = (response.items || []).map((item: any) => ({
        id: item.id.toString(),
        driverId,
        type: (item.type || 'system') as NotificationType,
        title: item.title || 'اعلان جدید',
        message: item.body || item.message || '',
        data: item.data,
        read: item.isRead || false,
        timestamp: item.createdAt || new Date().toISOString(),
      }));

      setState((prev) => ({
        ...prev,
        notifications: mappedNotifications,
        unreadCount: mappedNotifications.filter((n) => !n.read).length,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setState((prev) => ({ ...prev, isLoading: false, error: 'خطا در دریافت اعلان‌ها' }));
    }
  }, [driverId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByType,
    getUnreadNotifications,
  };
}
