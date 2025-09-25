import fastifyJwt from '@fastify/jwt';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { authUser, createUser } from './user/user.controller';
import UserError from './errors/error-user-handling';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
const app = Fastify();
app.register(fastifyJwt, {
  secret: process.env.SECRET_JWT || 'supersecret',
});

export function generateToken(userId: string, rememberMe: boolean = false) {
  const timeExpire = rememberMe ? '7d' : '1h';
  return app.jwt.sign({ id: userId }, { expiresIn: timeExpire });
}

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (_error) {
    const userError = new UserError(401, 'authentication failure', 'USR_10', 'Invalid Token');
    reply.code(userError.statusCode).send(userError);
  }
});

export async function runServer(port: number) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof UserError) {
      reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    } else {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
  app.get('/hello', () => {
    return 'hello, world!';
  });

  app.post('/auth', authUser);
  app.post('/users', { onRequest: [app.authenticate] }, createUser);
  try {
    const server = await app.listen({ port });
    console.log(`The server is running on port ${port}`);
    return server;
  } catch (error) {
    console.log(error);
  }
}

export async function closeServer() {
  try {
    await app.close();
  } catch (error) {
    console.log('an error happened', error);
  }
}
