import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationType } from '@/lib/types';

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

  // Simulate receiving notifications
  useEffect(() => {
    const mockNotifications: Array<{
      type: NotificationType;
      title: string;
      message: string;
    }> = [
      {
        type: 'order_assigned',
        title: 'سفارش جدید',
        message: 'سفارش جدیدی برای شما تخصیص داده شد',
      },
      {
        type: 'delivery_completed',
        title: 'تحویل موفق',
        message: 'تحویل شما با موفقیت ثبت شد',
      },
      {
        type: 'payment_received',
        title: 'پرداخت دریافت شد',
        message: 'درآمد امروز شما واریز شد',
      },
    ];

    // Add mock notifications on mount
    mockNotifications.forEach((notif, index) => {
      setTimeout(() => {
        addNotification(notif.type, notif.title, notif.message);
      }, index * 2000);
    });
  }, []);

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
