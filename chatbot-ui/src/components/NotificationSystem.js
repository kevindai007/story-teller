import React, { useState, useCallback } from 'react';

/**
 * Custom hook for managing notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};

/**
 * Notification Component
 */
const NotificationToast = ({ notification, onRemove }) => {
  return (
    <div className={`notification-toast notification-toast--${notification.type}`}>
      <span>{notification.message}</span>
      <button
        onClick={() => onRemove(notification.id)}
        className="notification-close"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Notification Container
 */
const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
