import prisma from '../../config';

export const createJournalEntry = async (data: any) => {
  // Assumes a JournalEntry model exists in Prisma schema
  return prisma.journalEntry.create({ data });
};

export const getJournalEntries = async (query: any) => {
  // Filter by date, employeeId, projectId if provided
  const where: any = {};
  if (query.date) where.date = query.date;
  if (query.employeeId) where.employeeId = query.employeeId;
  if (query.projectId) where.projectId = query.projectId;
  return prisma.journalEntry.findMany({ where });
};
