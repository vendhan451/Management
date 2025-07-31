import { PrismaClient } from '@prisma/client';
import { ProjectCreateInput, ProjectUpdateInput } from '../validators/project.validators';

const prisma = new PrismaClient();

export const createProject = async (data: ProjectCreateInput) => {
  return await prisma.project.create({
    data,
  });
};

export const getProjectById = async (id: string) => {
  return await prisma.project.findUnique({
    where: { id },
  });
};

export const updateProject = async (id: string, data: ProjectUpdateInput) => {
  return await prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProject = async (id: string) => {
  return await prisma.project.delete({
    where: { id },
  });
};

export const getAllProjects = async () => {
  return await prisma.project.findMany();
};
