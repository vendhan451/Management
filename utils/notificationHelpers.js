// Notification helpers
export function saveNotification(notification) {
  const notifications = getNotifications();
  notifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function getNotifications() {
  const raw = localStorage.getItem('notifications');
  return raw ? JSON.parse(raw) : [];
}

export function createNotification({ userId, title, message, type }) {
  return {
    id: Date.now(),
    userId,
    title,
    message,
    read: false,
    type,
    createdAt: Date.now(),
  };
}
