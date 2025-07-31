import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { createWorkReportSchema, updateWorkReportSchema } from '../validators/work-report.validators';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

type CreateWorkReportInput = z.infer<typeof createWorkReportSchema>;
type UpdateWorkReportInput = z.infer<typeof updateWorkReportSchema>;

export class DailyWorkReportService {
  async createReport(userId: string, data: CreateWorkReportInput) {
    const { date, projectLogItems } = data;

    const logItemsWithProjectNames = await Promise.all(
      projectLogItems.map(async (item) => {
        const project = await prisma.project.findUnique({ where: { id: item.projectId } });
        if (!project) {
          throw new AppError(`Project with id ${item.projectId} not found`, 404);
        }
        return { ...item, projectName: project.name };
      })
    );

    return await prisma.dailyWorkReport.upsert({
      where: { userId_date: { userId, date: new Date(date) } },
      create: {
        userId,
        date: new Date(date),
        submittedAt: new Date(),
        projectLogItems: {
          create: logItemsWithProjectNames.map(({ projectId, ...rest }) => ({
            ...rest,
            project: { connect: { id: projectId } },
          })),
        },
      },
      update: {
        projectLogItems: {
          deleteMany: {},
          create: logItemsWithProjectNames.map(({ projectId, ...rest }) => ({
            ...rest,
            project: { connect: { id: projectId } },
          })),
        },
      },
    });
  }

  async updateReport(reportId: string, userId: string, data: UpdateWorkReportInput) {
    const existingReport = await prisma.dailyWorkReport.findUnique({ where: { id: reportId } });
    if (!existingReport || existingReport.userId !== userId) {
      throw new AppError('Report not found or you do not have permission to update it.', 404);
    }
    const { date, projectLogItems } = data;

    const logItemsWithProjectNames = await Promise.all(
      projectLogItems.map(async (item) => {
        const project = await prisma.project.findUnique({ where: { id: item.projectId } });
        if (!project) {
          throw new AppError(`Project with id ${item.projectId} not found`, 404);
        }
        return { ...item, projectName: project.name };
      })
    );

    return await prisma.dailyWorkReport.update({
      where: { id: reportId },
      data: {
        date: new Date(date),
        projectLogItems: {
          deleteMany: {},
          create: logItemsWithProjectNames.map(({ projectId, ...rest }) => ({
            ...rest,
            project: { connect: { id: projectId } },
          })),
        },
      },
    });
  }

  async getReport(reportId: string) {
    return await prisma.dailyWorkReport.findUnique({ where: { id: reportId } });
  }

  async deleteReport(reportId: string) {
    return await prisma.dailyWorkReport.delete({ where: { id: reportId } });
  }
}
