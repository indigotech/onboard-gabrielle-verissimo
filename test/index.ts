import { expect } from 'chai';
import prismaInstance from '../src/db';
import { closeServer, runServer } from '../src/server';
import { endpoint, port } from './utils/config-test';

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

import './auth-test';
import './create-user-test';
import './get-user-test';
import './list-users-test';

after(async () => {
  await prismaInstance.user.deleteMany();
  await prismaInstance.$disconnect();
  await closeServer();
});
