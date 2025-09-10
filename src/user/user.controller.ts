import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRep, UserReq } from './user.model';
import { create } from './user.service';

export async function createUser(request: FastifyRequest<{ Body: UserReq }>, reply: FastifyReply) {
  try {
    const rep: UserRep = await create(request.body);
    delete rep.password;

    reply.status(201).send(rep);
  } catch (error) {
    reply.send(error);
  }
}
