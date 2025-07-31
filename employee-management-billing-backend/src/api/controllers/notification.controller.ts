import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

export const sendNotification = async (req: Request, res: Response) => {
  const notification = await notificationService.sendNotification(req.body);
  res.status(201).json(notification);
};

export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await notificationService.getNotifications(req.query);
  res.json(notifications);
};
