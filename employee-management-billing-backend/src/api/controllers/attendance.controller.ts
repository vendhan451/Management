import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { AppError } from '../utils/errorHandler';

const attendanceService = new AttendanceService();

export const clockIn = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const attendanceRecord = await attendanceService.clockIn(userId);
        res.status(201).json(attendanceRecord);
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

export const clockOut = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const attendanceRecord = await attendanceService.clockOut(userId);
        res.status(200).json(attendanceRecord);
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

export const getStatus = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const status = await attendanceService.getStatus(userId);
        res.status(200).json(status);
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
