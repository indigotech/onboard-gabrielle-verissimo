import axios from 'axios';
import { expect } from 'chai';
import prismaInstance from '../src/db';
import { closeServer, runServer } from '../src/server';
import authTest from './auth-test';
import createUserTest from './create-user-test';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
const endpoint = axios.create({
  baseURL: `http://localhost:${port}`,
});

before(async () => {
  try {
    await runServer(port);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

describe('Hello, world endpoint', () => {
  it(`return "hello, world!"`, async () => {
    const response = await endpoint.get('/hello');
    expect(response.data).to.be.eq('hello, world!');
  });
});

authTest(expect, endpoint, prismaInstance);
createUserTest(expect, endpoint, prismaInstance);

after(async () => {
  await prismaInstance.$disconnect();
  await closeServer();
});
