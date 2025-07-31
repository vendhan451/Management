import { Request, Response } from 'express';
import * as fcmService from '../services/fcm.service';

export const registerFcmToken = async (req: Request, res: Response) => {
  const { userId, token } = req.body;
  await fcmService.saveFcmToken(userId, token);
  res.status(200).json({ success: true });
};

export const adminBroadcast = async (req: Request, res: Response) => {
  const { title, body } = req.body;
  const result = await fcmService.adminBroadcast(title, body);
  res.status(200).json(result);
};
