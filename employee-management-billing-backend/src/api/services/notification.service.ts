import prisma from '../../config';
// import { sendFCM, sendEmail } from '../../utils/notificationHelpers'; // If you have helpers

export const sendNotification = async (data: any) => {
  // Save notification to DB
  const notification = await prisma.notification.create({ data });
  // Optionally send FCM/email here
  // if (data.fcmToken) await sendFCM(data.fcmToken, data.title, data.body);
  // if (data.email) await sendEmail(data.email, data.title, data.body);
  return notification;
};

export const getNotifications = async (query: any) => {
  // Filter by recipientId if provided
  const where: any = {};
  if (query.recipientId) where.recipientId = query.recipientId;
  return prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' } });
};
