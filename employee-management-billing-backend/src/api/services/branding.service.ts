import prisma from '../../config';

export const updateBranding = async (data: any) => {
  // Assumes a single Company record, update branding fields in Company.settings
  return prisma.company.update({
    where: { id: data.companyId },
    data: { settings: data.settings }
  });
};

export const getBranding = async () => {
  // Assumes a single Company record
  const company = await prisma.company.findFirst();
  return company?.settings || {};
};
