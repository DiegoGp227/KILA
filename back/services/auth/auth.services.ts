import bcrypt from "bcryptjs";
import prisma from "../../db/prisma.js";
import { ICreateUser, ILoginUser, IUserResponse } from "../../types/user.types.js";
import { EmailAlreadyInUseError, InvalidCredentialsError } from "../../erros/businessErrors.js";

export const createUser = async (
  userData: ICreateUser
): Promise<IUserResponse> => {
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

export const loginuser = async (
  userData: ILoginUser
): Promise<IUserResponse> => {

  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!existingUser) {
    throw new InvalidCredentialsError(userData.email);
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    existingUser.passwordHash
  );

  if (!isPasswordValid) {
    throw new InvalidCredentialsError(userData.email);
  }

  return {
    id: existingUser.id,
    username: existingUser.username,
    email: existingUser.email,
    createdAt: existingUser.createdAt,
    updatedAt: existingUser.updatedAt,
  };
};
