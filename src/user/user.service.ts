import { UserCreateRep, UserCreateReq } from './user.model';
import { cepValidate, createUserValidate } from './user.validation';
import { hashPassword, verifyPassword } from '../utils/hash';
import UserError from '../errors/error-user-handling';
import { PrismaCreate, PrismaFindByEmail, PrismaGetAllUsers, PrismaGetUser } from './user.repository';

export async function create(user: UserCreateReq) {
  const addresses = Array.isArray(user.address)
    ? user.address.map(address => ({
        ...address,
        complement: address.complement ?? '',
      }))
    : [];

  if (addresses.length > 0) {
    for (const address of addresses) {
      const validCep = await cepValidate(address.cep);
      if (validCep !== true) {
        throw new UserError(
          400,
          'Invalid CEP',
          'USR_07',
          `The CEP ${address.cep} is invalid. Please check if you entered the CEP correctly.`,
        );
      }
    }
  }
  const [userEmail, userPassword] = createUserValidate(user);
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
  const post = await PrismaCreate(user, addresses);

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

export async function getAllUsers(skip: number, take: number) {
  if (Number.isNaN(take) || take <= 0) {
    take = 20;
  }
  if (Number.isNaN(skip) || skip <= 0) {
    skip = 0;
  }
  const [users, total] = await PrismaGetAllUsers(skip, take);
  if (!users) {
    throw new UserError(404, 'Users not found', 'USR_06', 'No users were found.');
  }
  const previousCounter = skip - take < 0 || skip === 0 ? null : skip - take;
  const nextCounter = take + skip >= total ? null : take + skip;
  let previous = `http://localhost:8080/users/list?skip=${previousCounter}&take=${take}`;
  if (previousCounter === null) {
    previous = 'null';
  }
  let next = `http://localhost:8080/users/list?skip=${nextCounter}&take=${take}`;
  if (nextCounter === null) {
    next = 'null';
  }
  return { total, previous, next, users };
}
