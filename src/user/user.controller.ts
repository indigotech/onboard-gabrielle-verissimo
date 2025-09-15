import { FastifyReply, FastifyRequest } from 'fastify';
import { UserReq } from './user.model';
import { create } from './user.service';

export async function createUser(request: FastifyRequest<{ Body: UserReq }>, reply: FastifyReply) {
  try {
    const rep = await create(request.body);
    reply.status(201).send(rep);
  } catch (error) {
    reply.send(error);
  }
}
