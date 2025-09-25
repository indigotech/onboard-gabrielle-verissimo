import { FastifyReply, FastifyRequest } from 'fastify';
import { UserAuthReq, UserCreateReq } from './user.model';
import { auth, create } from './user.service';
import { generateToken } from '../server';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const user: UserCreateReq = request.body as UserCreateReq;
  try {
    const rep = await create(user);
    return reply.status(201).send(rep);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send(error);
  }
}

export async function authUser(request: FastifyRequest<{ Body: UserAuthReq }>, reply: FastifyReply) {
  const { email, password, rememberMe } = request.body;
  try {
    const { user } = await auth(email, password);
    const token = `Bearer ${generateToken(user.id, rememberMe)}`;
    const rep = { user: user, token };

    return reply.send(rep);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send(error);
  }
}
