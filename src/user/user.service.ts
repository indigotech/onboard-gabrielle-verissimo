import { PrismaClient } from '@prisma/client';
import { UserRep, UserReq } from './user.model';
import { createUserValidation } from './user.validation';
import { hashPassword } from '../utils/hash';

const prisma = new PrismaClient();

export async function create(user: UserReq) {
  const [userEmail, userPassword] = createUserValidation(user);
  if (!userEmail?.success) {
    throw new Error(userEmail?.error.message);
  }
  if (!userPassword?.success) {
    throw new Error(userPassword?.error.message);
  }
  const existsEmail = await uniqueEmail(user.email);

  if (existsEmail) {
    throw new Error('Já existe um usuario com esse email.');
  }
  user.password = await hashPassword(user.password);
  const post = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
    },
  });

  const reply: UserRep = post;
  delete reply.password;

  return reply;
}

async function uniqueEmail(email: string) {
  try {
    const uniqueEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return uniqueEmail;
  } catch (error) {
    console.log(error);
    return false;
  }
}
