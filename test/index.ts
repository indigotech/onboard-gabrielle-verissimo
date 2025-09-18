import axios from 'axios';
import { expect } from 'chai';
import prismaInstance from '../src/db';
import { closeServer, runServer } from '../src/server';
import { UserReq } from '../src/user/user.model';
import { hashPassword, verifyPassword } from '../src/utils/hash';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
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

describe('Create user endpoint', () => {
  it('Response and create sucess', async () => {
    const hash = await hashPassword(input.password);
    const response = await endpoint.post('/users', input);
    const userCreated = (await prismaInstance.user.findUnique({
      where: {
        email: input.email,
      },
    }))!;
    expect(userCreated.name).to.be.deep.eq(input.name);
    expect(userCreated.email).to.be.deep.eq(input.email);
    expect(userCreated.birthDate).to.be.deep.eq(input.birthDate);
    const verifyHash = await verifyPassword(hash, input.password);
    expect(verifyHash).to.be.eq(true);
    expect(response.status).to.be.deep.eq(201);
    expect(response.data).to.be.deep.eq({
      id: userCreated.id,
      name: input.name,
      email: input.email,
      birthDate: input.birthDate,
    });
  });
});

after(async () => {
  await prismaInstance.$disconnect();
  await closeServer();
});
