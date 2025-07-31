import prisma from '../../config';

export const logLocation = async (data: any) => {
  // Assumes a LocationLog model exists in Prisma schema
  return prisma.locationLog.create({ data });
};

export const getLocations = async (query: any) => {
  // Filter by userId if provided
  const where: any = {};
  if (query.userId) where.userId = query.userId;
  return prisma.locationLog.findMany({ where, orderBy: { timestamp: 'desc' } });
};
