import { PrismaClient, Company } from '@prisma/client';

const prisma = new PrismaClient();

export const getCompany = async (): Promise<Company | null> => {
  return prisma.company.findFirst();
};

export const updateCompany = async (data: Partial<Company>): Promise<Company> => {
  const existing = await prisma.company.findFirst();
  if (existing) {
    return prisma.company.update({ where: { id: existing.id }, data });
  } else {
    return prisma.company.create({ data: data as Company });
  }
};
