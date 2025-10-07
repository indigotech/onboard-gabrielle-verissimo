import prismaInstance from '../db';
import { UserCreateReq } from './user.model';

const prisma = prismaInstance;

export async function PrismaCreate(user: UserCreateReq, addresses: any) {
  return await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
      address: {
        create: addresses,
      },
    },
    include: {
      address: true,
    },
    omit: {
      password: true,
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
    include: {
      address: true,
    },
    omit: {
      password: true,
    },
  });
}

export async function PrismaGetAllUsers(skip: number, take: number) {
  return await prisma.$transaction([
    prisma.user.findMany({
      omit: {
        password: true,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
      include: {
        address: true,
      },
    }),
    prisma.user.count(),
  ]);
}
