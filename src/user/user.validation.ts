import { z } from 'zod';
import { UserReq } from './user.model';

const email = z.email();
const password = z
  .string()
  .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  .regex(/[a-zA-Z]/, { message: 'A senha deve conter pelo menos uma letra.' })
  .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um dígito.' });

export function createUserValidation(user: UserReq) {
  const userEmail = email.safeParse(user.email);
  const userPassword = password.safeParse(user.password);

  return [userEmail, userPassword];
}
