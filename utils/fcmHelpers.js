// Firebase FCM Setup and Push Notification Helpers
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  return messaging;
}

export async function requestFcmPermissionAndSaveToken(userId) {
  const messaging = initFirebase();
  try {
    const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    if (token) {
      localStorage.setItem('fcmToken', token);
      // Send token to backend
      await fetch('/api/v1/fcm/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token })
      });
    }
    return token;
  } catch (err) {
    console.error('FCM permission error', err);
    return null;
  }
}

export function onFcmMessage(callback) {
  const messaging = initFirebase();
  onMessage(messaging, callback);
}

export function sendPush(title, body, url) {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, { body, data: { url } });
    });
  }
}
