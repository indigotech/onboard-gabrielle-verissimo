import axios from 'axios';
import * as chai from 'chai';
import prismaInstance from '../src/db';
import { closeServer, runServer } from '../src/server';
import { UserReq } from '../src/user/user.model';
import { hashPassword } from '../src/utils/hash';

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
    chai.expect(response.data).to.be.eq('hello, world!');
  });
});

describe('Create user endpoint', () => {
  it('Response and create sucess', async () => {
    const hash = await hashPassword(input.password);

    const response = await endpoint.post('/users', input);
    chai.expect(response.status).to.be.deep.eq(201);
    const userCreated = (await prismaInstance.user.findUnique({
      where: {
        email: input.email,
      },
    }))!;
    chai.expect(userCreated.id).to.be.deep.eq(response.data.id);
    chai.expect(userCreated.name).to.be.deep.eq(input.name);
    chai.expect(userCreated.email).to.be.deep.eq(input.email);
    chai.expect(userCreated.birthDate).to.be.deep.eq(input.birthDate);
    chai.expect(userCreated.password).to.not.be.deep.eq(hash);
    chai.expect(response.data.name).to.be.deep.eq(input.name);
    chai.expect(response.data.email).to.be.deep.eq(input.email);
    chai.expect(response.data.birthDate).to.be.deep.eq(input.birthDate);
    chai.expect(response.data).to.not.be.deep.eq(input.password);
  });
});

after(async () => {
  await prismaInstance.$disconnect();
  await closeServer();
});
