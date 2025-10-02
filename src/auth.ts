import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import UserError from './errors/error-user-handling';
import fp from 'fastify-plugin';
import { app } from './server';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (_error) {
    const userError = new UserError(401, 'authentication failure', 'USR_10', 'Invalid Token');
    reply.code(userError.statusCode).send(userError);
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', authenticate);
}

export function generateToken(userId: string, rememberMe: boolean = false) {
  const timeExpire = rememberMe ? '7d' : '1h';
  return app.jwt.sign({ id: userId }, { expiresIn: timeExpire });
}

export default fp(authPlugin);
