import Fastify from 'fastify';
import { createUser } from './user/user.controller';

const app = Fastify();

app.get('/hello', () => {
  return 'hello, world';
});

app.post('/users', createUser);

app.listen({ port: 8080 }).then(() => {
  console.log('Acessar http://localhost:8080/hello');
});
