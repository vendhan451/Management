import { PrismaClient, User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { UserCreateInput, UserUpdateInput } from '../validators/user.validators';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

export const userService = {
  createUser: async (data: UserCreateInput): Promise<User> => {
    const { password, joinDate, ...rest } = data;
    const passwordHash = await hash(password, 10);

    const createPayload: any = {
      ...rest,
      passwordHash,
    };

    if (joinDate) {
      createPayload.joinDate = new Date(joinDate);
    }

    return await prisma.user.create({
      data: createPayload,
    });
  },

  getUserById: async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  updateUser: async (id: string, data: UserUpdateInput): Promise<User> => {
    const { password, joinDate, ...rest } = data;
    const updatePayload: any = { ...rest };

    if (password) {
      updatePayload.passwordHash = await hash(password, 10);
    }

    if (joinDate) {
      updatePayload.joinDate = new Date(joinDate);
    }

    return await prisma.user.update({
      where: { id },
      data: updatePayload,
    });
  },

  deleteUser: async (id: string): Promise<User> => {
    return await prisma.user.delete({
      where: { id },
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany();
  },

  changePassword: async (id: string, currentPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    const newPasswordHash = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });
  },
};
