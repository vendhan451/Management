import { Request, Response } from 'express';
import { leaveRequestService } from '../services/leave-request.service';
import { AppError } from '../utils/errorHandler';

export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const leaveRequest = await leaveRequestService.createLeaveRequest(userId, req.body);
    res.status(201).json(leaveRequest);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const cancelLeaveRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  try {
    // @ts-ignore
    const leaveRequest = await leaveRequestService.cancelLeaveRequest(requestId, req.user.id);
    res.status(200).json(leaveRequest);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: 'An unknown error occurred' });
    }
  }
};
