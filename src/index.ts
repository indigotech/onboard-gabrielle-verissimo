import Fastify from 'fastify';
import { runServer } from './server';
import dotenv from 'dotenv';
import { createUser } from './user/user.controller';

dotenv.config({ path: '../.env' });
const app = Fastify();

app.get('/hello', () => {
  return 'hello, world!';
});

app.post('/users', createUser);

const port: number = process.env.PORT;

runServer(app, port);
