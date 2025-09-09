import { PrismaClient } from '@prisma/client';
import { UserReq } from './user.model';

const prisma = new PrismaClient();

export async function create(user: UserReq) {
  const post = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
    },
  });

  return post;
}
