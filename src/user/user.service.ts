import { UserCreateRep, UserCreateReq } from './user.model';
import { createUserValidation } from './user.validation';
import { hashPassword, verifyPassword } from '../utils/hash';
import UserError from '../errors/error-user-handling';
import { PrismaCreate, PrismaFindByEmail, PrismaGetAllUsers, PrismaGetUser } from './user.repository';

export async function create(user: UserCreateReq) {
  const [userEmail, userPassword] = createUserValidation(user);
  if (!userEmail?.success) {
    const errorEmail: string = userEmail?.error.issues.map(e => e.message).join(' ') || '';
    throw new UserError(400, errorEmail, 'USR_02', 'Invalid email. Please check if you entered the email correctly.');
  }
  if (!userPassword?.success) {
    const errorPassword: string = userPassword?.error.issues.map(e => e.message).join(' ') || '';
    throw new UserError(
      400,
      errorPassword,
      'USR_01',
      'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    );
  }
  const existsEmail = await PrismaFindByEmail(user.email);

  if (existsEmail) {
    throw new UserError(
      400,
      'Invalid credential',
      'USR_03',
      'There is already a user registered with this email. Please provide a different email address.',
    );
  }
  user.password = await hashPassword(user.password);
  const post = await PrismaCreate(user);

  const reply: UserCreateRep = post;
  delete reply.password;

  return reply;
}

export async function auth(email: string, password: string) {
  const user = await PrismaFindByEmail(email);
  if (!user) {
    throw new UserError(400, 'Login fail', 'USR_04', 'Email or password incorrect. Try again.');
  }
  const verifyHash = await verifyPassword(user.password, password);
  if (!verifyHash) {
    throw new UserError(400, 'Login fail', 'USR_04', 'Email or password incorrect. Try again.');
  }
  delete user.password;

  return user;
}

export async function getUser(id: string) {
  const user = await PrismaGetUser(id);
  if (!user) {
    throw new UserError(404, 'User not found', 'USR_05', 'No user was found with that ID.');
  }
  return user;
}

export async function getAllUsers(qnt: number) {
  if (Number.isNaN(qnt) || qnt <= 0) {
    qnt = 20;
  }
  const users = await PrismaGetAllUsers(qnt);
  if (!users) {
    throw new UserError(404, 'Users not found', 'USR_06', 'No users were found.');
  }

  return users;
}
