import { UserRep, UserReq } from './user.model';
import { createUserValidation } from './user.validation';
import { hashPassword } from '../utils/hash';
import prismaInstance from '../db';
import UserError from '../errors/error-user-handling';

const prisma = prismaInstance;

export async function create(user: UserReq) {
  const [userEmail, userPassword] = createUserValidation(user);
  if (!userEmail?.success) {
    const errorEmail: string = userEmail?.error.message || '';
    const error = new UserError(
      400,
      errorEmail,
      'USR_02',
      'Invalid email. Please check if you entered the email correctly.',
    );
    if (error instanceof UserError) {
      throw {
        statusCode: error.statusCode,
        code: error.code,
        error: error.name,
        message: error.message,
        details: error.details,
      };
    }
  }
  if (!userPassword?.success) {
    const errorPassword: string = userPassword?.error.message || '';
    const error = new UserError(
      400,
      errorPassword,
      'USR_01',
      'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    );
    if (error instanceof UserError) {
      throw {
        statusCode: error.statusCode,
        code: error.code,
        error: error.name,
        message: error.message,
        details: error.details,
      };
    }
  }
  const existsEmail = await findByEmail(user.email);

  if (existsEmail) {
    const error = new UserError(
      400,
      'Invalid credential',
      'USR_03',
      'There is already a user registered with this email. Please provide a different email address.',
    );
    if (error instanceof UserError) {
      throw {
        statusCode: error.statusCode,
        code: error.code,
        error: error.name,
        message: error.message,
        details: error.details,
      };
    }
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

async function findByEmail(email: string) {
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
