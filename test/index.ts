import { fastify } from 'fastify';
import { runServer } from '../src/server';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '../.test.env' });
const app = fastify();
const port: number = process.env.PORT || 8081;
const server = axios.create({
  baseURL: `http://localhost:${port}`,
});

before(() => {
  app.get('/hello', () => {
    return 'hello, world!';
  });
  runServer(app, port);
});

describe('Hello, world endpoint', () => {
  it('return hello, world', async () => {
    const response = await server.get('/hello');
    console.log(response.data);
  });
});
