import Fastify from 'fastify';
import { authUser, createUser } from './user/user.controller';
import UserError from './errors/error-user-handling';

const app = Fastify();

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

  app.post('/users', createUser);
  app.post('/auth', authUser);

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
