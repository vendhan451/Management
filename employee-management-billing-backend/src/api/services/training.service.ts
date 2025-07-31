import prisma from '../../config';

export const getAllTrainings = async () => {
  return prisma.training.findMany({ include: { enrollments: true } });
};

export const createTraining = async (data: any) => {
  return prisma.training.create({ data });
};

export const updateTraining = async (id: string, updates: any) => {
  return prisma.training.update({ where: { id }, data: updates });
};

export const deleteTraining = async (id: string) => {
  return prisma.training.delete({ where: { id } });
};

export const enrollInTraining = async (trainingId: string, userId: string) => {
  return prisma.trainingEnrollment.create({ data: { trainingId, userId, status: 'PENDING' } });
};

export const approveTrainingEnrollment = async (trainingId: string, enrollmentId: string, approve: boolean) => {
  return prisma.trainingEnrollment.update({
    where: { id: enrollmentId },
    data: { status: approve ? 'APPROVED' : 'REJECTED' }
  });
};
