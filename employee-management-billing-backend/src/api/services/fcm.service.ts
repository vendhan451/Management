import admin from 'firebase-admin';
// import prisma from '../../config'; // Uncomment if you want to store tokens in DB

// Save FCM token for a user
export const saveFcmToken = async (userId: string, token: string) => {
  // TODO: Save token to DB (e.g., User.fcmToken or a separate table)
  // await prisma.user.update({ where: { id: userId }, data: { fcmToken: token } });
  return true;
};

// Admin broadcast to all users
export const adminBroadcast = async (title: string, body: string) => {
  // TODO: Fetch all FCM tokens from DB
  // const tokens = await prisma.user.findMany({ select: { fcmToken: true } });
  // const tokenList = tokens.map(t => t.fcmToken).filter(Boolean);
  const tokenList: string[] = []; // Replace with real tokens
  if (tokenList.length === 0) return { sent: 0 };
  const message = {
    notification: { title, body },
    tokens: tokenList
  };
  const response = await admin.messaging().sendMulticast(message);
  return { sent: response.successCount };
};
