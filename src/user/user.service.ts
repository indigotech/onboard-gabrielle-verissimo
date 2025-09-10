import { PrismaClient } from '@prisma/client';
import { UserReq } from './user.model';
import { createUserValidation } from './user.validation';

const prisma = new PrismaClient();

export async function create(user: UserReq) {
  const [userEmail, userPassword] = createUserValidation(user);
  if (!userEmail?.success) {
    return userEmail?.error.message;
  }
  if (!userPassword?.success) {
    return userPassword?.error.message;
  }
  const existsEmail = await uniqueEmail(user.email);

  if (existsEmail) {
    return 'Já existe um usuario com esse email.';
  }

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
