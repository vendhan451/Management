import prisma from '../../config';

export const getClientProjects = async (query: any) => {
  // Filter by clientId if provided
  const where: any = {};
  if (query.clientId) where.clientId = query.clientId;
  return prisma.project.findMany({ where });
};

export const getClientBilling = async (query: any) => {
  // Filter by clientId if provided
  const where: any = {};
  if (query.clientId) where.clientId = query.clientId;
  return prisma.billingRecord.findMany({ where });
};
