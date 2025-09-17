import { FastifyReply, FastifyRequest } from 'fastify';
import { UserCreateReq } from './user.model';
import { auth, create } from './user.service';

const mock = {
  user: {
    id: 12,
    name: 'User Name',
    email: 'user@email.com',
    birthDate: '1990-04-25',
  },
  token: 'the_token',
};
export async function createUser(request: FastifyRequest<{ Body: UserCreateReq }>, reply: FastifyReply) {
  try {
    const rep = await create(request.body);
    reply.status(201).send(rep);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send(error);
  }
}

export async function authUser(request: FastifyRequest<{ Body: string }>, reply: FastifyReply) {
  const { email, password } = request.body;
  try {
    const rep = await auth(email, password);
    reply.send(rep);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send(error);
  }
}
