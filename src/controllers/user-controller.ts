import { FastifyReply, FastifyRequest } from 'fastify';

interface ReqUser {
  name: string;
  email: string;
  password: string;
  birthDate: Date;
}

interface ResUser extends ReqUser {
  id: string;
}

export async function createUser(request: FastifyRequest<{ Body: ReqUser }>, reply: FastifyReply) {
  const user = request.body;
  const rep: ResUser = { id: '1', ...user };

  reply.send(rep);
}
