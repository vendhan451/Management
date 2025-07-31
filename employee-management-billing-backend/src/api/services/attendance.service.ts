import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

export class AttendanceService {
  async clockIn(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId,
        clockInTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingRecord) {
      throw new AppError('User has already clocked in for today.', 400);
    }

    return await prisma.attendanceRecord.create({
      data: {
        userId,
        date: today,
        clockInTime: new Date(),
      },
    });
  }

  async clockOut(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendanceRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId,
        clockInTime: {
          gte: today,
          lt: tomorrow,
        },
        clockOutTime: null,
      },
    });

    if (!attendanceRecord) {
      throw new AppError('No clock-in record found for today or already clocked out.', 400);
    }

    const clockOutTime = new Date();
    const totalHours = Math.abs(clockOutTime.getTime() - new Date(attendanceRecord.clockInTime).getTime()) / (1000 * 60 * 60);

    return await prisma.attendanceRecord.update({
      where: { id: attendanceRecord.id },
      data: {
        clockOutTime,
        totalHours,
      },
    });
  }

  async getStatus(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendanceRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId,
        clockInTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        clockInTime: 'desc',
      },
    });

    if (!attendanceRecord) {
      return { status: 'Clocked Out' };
    }

    return attendanceRecord.clockOutTime
      ? { status: 'Clocked Out', record: attendanceRecord }
      : { status: 'Clocked In', record: attendanceRecord };
  }
}
