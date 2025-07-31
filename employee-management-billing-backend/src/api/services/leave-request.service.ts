import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { leaveRequestSchema } from '../validators/leave-request.validators';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;

class LeaveRequestService {
  async createLeaveRequest(userId: string, data: LeaveRequestInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { startDate, endDate, ...rest } = data;
    return await prisma.leaveRequest.create({
      data: {
        ...rest,
        userId,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'PENDING',
        requestedAt: new Date(),
      },
    });
  }

  async cancelLeaveRequest(requestId: string, userId: string) {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: requestId },
    });

    if (!leaveRequest || leaveRequest.userId !== userId || leaveRequest.status !== 'PENDING') {
      throw new AppError('Leave request cannot be canceled.', 400);
    }

    return await prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });
  }

  async getLeaveRequestsByUser(userId: string) {
    return await prisma.leaveRequest.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
    });
  }
}

export const leaveRequestService = new LeaveRequestService();
