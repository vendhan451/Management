import React, { useEffect, useState } from 'react';
import { apiGetNotifications } from '../../services/api';
import { onFcmMessage } from '../../utils/fcmHelpers';
import { BellIcon } from '@heroicons/react/outline';

export default function NotificationBadge() {
  const [count, setCount] = useState(0);
  const [dropdown, setDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      const notifs = await apiGetNotifications({});
      setNotifications(notifs.slice(-5).reverse());
      setCount(notifs.filter(n => !n.read).length);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    // Listen for FCM push
    onFcmMessage(() => fetchNotifs());
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    // Optionally call backend to mark all as read
    setCount(0);
    setDropdown(false);
    // Optionally refetch notifications
  };

  return (
    <div className="relative inline-block">
      <button onClick={() => setDropdown(d => !d)} className="relative">
        <BellIcon className="h-6 w-6 text-gray-700" />
        {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">{count}</span>}
      </button>
      {dropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-2 z-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Notifications</span>
            <button onClick={markAllRead} className="text-xs text-blue-600">Mark all read</button>
          </div>
          <ul>
            {notifications.map((n, i) => (
              <li key={i} className="border-b last:border-0 py-1 text-sm">{n.title}: {n.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
