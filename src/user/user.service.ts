import { UserCreateRep, UserCreateReq } from './user.model';
import { createUserValidation } from './user.validation';
import { hashPassword, verifyPassword } from '../utils/hash';
import prismaInstance from '../db';
import UserError from '../errors/error-user-handling';

const prisma = prismaInstance;

export async function create(user: UserCreateReq) {
  const [userEmail, userPassword] = createUserValidation(user);
  if (!userEmail?.success) {
    const errorEmail: string = userEmail?.error.issues.map(e => e.message).join(' ') || '';
    throw new UserError(400, errorEmail, 'USR_02', 'Invalid email. Please check if you entered the email correctly.');
  }
  if (!userPassword?.success) {
    const errorPassword: string = userPassword?.error.issues.map(e => e.message).join(' ') || '';
    console.log('UserPassword');
    throw new UserError(
      400,
      errorPassword,
      'USR_01',
      'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    );
  }
  const existsEmail = await findByEmail(user.email);

  if (existsEmail) {
    throw new UserError(
      400,
      'Invalid credential',
      'USR_03',
      'There is already a user registered with this email. Please provide a different email address.',
    );
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

  const reply: UserCreateRep = post;
  delete reply.password;

  return reply;
}

export async function auth(email: string, password: string) {
  const user = await findByEmail(email);
  if (!user) {
    throw new UserError(
      400,
      'Login fail',
      'USR_04',
      'No user was found with that email. Please check if you entered the correct email address or register.',
    );
  }
  const verifyHash = await verifyPassword(user.password, password);
  if (!verifyHash) {
    throw new UserError(400, 'Login fail', 'USR_05', 'Incorrect password. Try again.');
  }
  delete user.password;

  return { user };
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
