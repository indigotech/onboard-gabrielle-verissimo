import { FastifyInstance } from 'fastify';

export function runServer(app: FastifyInstance, port: number) {
  app.listen({ port }).then(() => {
    console.log(`The server is running on port ${port}`);
  });
}
