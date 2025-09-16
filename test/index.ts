import axios from 'axios';
import * as chai from 'chai';
import prismaInstance from '../src/db';
import { closeServer, runServer } from '../src/server';
import { UserReq } from '../src/user/user.model';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
const prisma = prismaInstance;
const endpoint = axios.create({
  baseURL: `http://localhost:${port}`,
});
const input: UserReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxinha123',
  birthDate: '02-12-2000',
};

before(async () => {
  try {
    await prisma.$connect();
    await runServer(port);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

describe('Hello, world endpoint', () => {
  it(`return "hello, world!"`, async () => {
    const response = await endpoint.get('/hello');
    chai.expect(response.data).to.be.eq('hello, world!');
  });
});

describe('Create user endpoint', () => {
  it('Response sucess', async () => {
    const response = await endpoint.post('/users', input);
    chai.expect(response.status).to.be.eq(201);
    chai.expect(response.data).to.have.deep.property('id');
    chai.expect(response.data.name).to.be.deep.eq(input.name);
    chai.expect(response.data.email).to.be.deep.eq(input.email);
    chai.expect(response.data.birthDate).to.be.deep.eq(input.birthDate);
    chai.expect(response.data).to.not.have.property('password');
  });
});

after(async () => {
  await prisma.$disconnect();
  await closeServer();
});
