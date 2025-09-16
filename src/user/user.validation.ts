import { z } from 'zod';
import { UserCreateReq } from './user.model';

const email = z.email();
const password = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long.' })
  .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
  .regex(/[0-9]/, { message: 'Password must contain at least one digit.' });

export function createUserValidation(user: UserCreateReq) {
  const userEmail = email.safeParse(user.email);
  const userPassword = password.safeParse(user.password);
  return [userEmail, userPassword];
}
