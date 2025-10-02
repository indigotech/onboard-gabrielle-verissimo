import prismaInstance from '../db';
import { UserCreateReq } from './user.model';

const prisma = prismaInstance;

export async function PrismaCreate(user: UserCreateReq) {
  return await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
    },
  });
}

export async function PrismaFindByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function PrismaGetUser(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
  });
}

export async function PrismaGetAllUsers(skip: number, take: number) {
  return await prisma.$transaction([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        password: false,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.user.count(),
  ]);
}
