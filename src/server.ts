import Fastify from 'fastify';
import { createUser } from './user/user.controller';

const app = Fastify();

export async function runServer(port: number) {
  app.get('/hello', () => {
    return 'hello, world!';
  });

  app.post('/users', createUser);

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
