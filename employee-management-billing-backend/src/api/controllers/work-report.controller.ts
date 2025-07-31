import { Request, Response } from 'express';
import { DailyWorkReportService } from '../services/work-report.service';
import { AppError } from '../utils/errorHandler';

const workReportService = new DailyWorkReportService();

export const createWorkReport = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const report = await workReportService.createReport(userId, req.body);
        res.status(201).json(report);
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

export const updateWorkReport = async (req: Request, res: Response) => {
    try {
        const reportId = req.params.reportId;
        // @ts-ignore
        const userId = req.user.id;
        const updatedReport = await workReportService.updateReport(reportId, userId, req.body);
        res.status(200).json(updatedReport);
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

export const getWorkReport = async (req: Request, res: Response) => {
    try {
        const reportId = req.params.reportId;
        const report = await workReportService.getReport(reportId);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};

export const deleteWorkReport = async (req: Request, res: Response) => {
    try {
        const reportId = req.params.reportId;
        await workReportService.deleteReport(reportId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
