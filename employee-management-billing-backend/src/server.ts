import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes';
import userRoutes from './api/routes/user.routes';
import projectRoutes from './api/routes/project.routes';
import workReportRoutes from './api/routes/work-report.routes';
import leaveRequestRoutes from './api/routes/leave-request.routes';
import attendanceRoutes from './api/routes/attendance.routes';
import billingRecordRoutes from './api/routes/billing-record.routes';
import billingCalculatorRoutes from './api/routes/billing-calculator.routes';
import dashboardRoutes from './api/routes/dashboard.routes';
import messageRoutes from './api/routes/message.routes';
import aiRoutes from './api/routes/ai.routes';
import errorMiddleware from './api/middleware/error.middleware';
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// API v1 routes with proper prefix
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/work-reports', workReportRoutes);
app.use('/api/v1/leave-requests', leaveRequestRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/billing', billingRecordRoutes); // Changed from billing-records to billing
app.use('/api/v1/billing-calculator', billingCalculatorRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/ai', aiRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});