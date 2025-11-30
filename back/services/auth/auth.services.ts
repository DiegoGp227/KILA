import bcrypt from 'bcryptjs';
import prisma from '../../db/prisma.js';
import { ICreateUserDTO, IUserResponse } from '../../types/user.types';
import { EmailAlreadyInUseError } from '../../erros/businessErrors';

export const createUser = async (userData: ICreateUserDTO): Promise<IUserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new EmailAlreadyInUseError(userData.email);
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
