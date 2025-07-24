import { useApp } from '../contexts/AppContext';
import { Notification } from '../types';

export function useNotification() {
  const { dispatch } = useApp();

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    
    // Auto-remove after 5 seconds for non-critical notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: newNotification.id });
      }, 5000);
    }
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  return { addNotification, markAsRead };
}