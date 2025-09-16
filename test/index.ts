import axios from 'axios';
import { expect } from 'chai';
import prismaInstance from '../src/db';
import { closeServer, runServer } from '../src/server';
import { verifyPassword } from '../src/utils/hash';
import { UserCreateReq } from '../src/user/user.model';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
const endpoint = axios.create({
  baseURL: `http://localhost:${port}`,
});

const inputCreateUser: UserCreateReq = {
  name: 'João',
  email: 'joao@gmail.com',
  password: 'senha123',
  birthDate: '09-09-2001',
};

const input: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxinha12',
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
  it('Response and create success', async () => {
    const response = await endpoint.post('/users', inputCreateUser);
    const userCreated = (await prismaInstance.user.findUnique({
      where: {
        email: inputCreateUser.email,
      },
    }))!;
    expect(userCreated.name).to.be.deep.eq(inputCreateUser.name);
    expect(userCreated.email).to.be.deep.eq(inputCreateUser.email);
    expect(userCreated.birthDate).to.be.deep.eq(inputCreateUser.birthDate);
    const verifyHash = await verifyPassword(userCreated.password, inputCreateUser.password);
    expect(verifyHash).to.be.eq(true);
    expect(response.status).to.be.deep.eq(201);
    expect(response.data).to.be.deep.eq({
      id: userCreated.id,
      name: inputCreateUser.name,
      email: inputCreateUser.email,
      birthDate: inputCreateUser.birthDate,
    });
  });

  describe('Errors creating user', () => {
    it('Error when email already exists', async () => {
      try {
        await endpoint.post('/users', input);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_03',
          message: 'Invalid credential',
          details: 'There is already a user registered with this email. Please provide a different email address.',
        });
      }
    });

    describe('Password invalid', () => {
      const inputPasswordWithoutDigit: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: 'coxinha',
        birthDate: '02-12-2000',
      };
      it('Error when password does not contain a digit', async () => {
        try {
          await endpoint.post('/users', inputPasswordWithoutDigit);
        } catch (error: any) {
          expect(error.response.status).to.be.deep.eq(400);
          expect(error.response.data).to.be.deep.eq({
            code: 'USR_01',
            message: 'Password must contain at least one digit.',
            details:
              'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
          });
        }
      });
    });
    it('Error when password is less than 6 characters', async () => {
      const inputPasswordLessThan6: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: 'coxi1',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputPasswordLessThan6);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_01',
          message: 'Password must be at least 6 characters long.',
          details:
            'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
        });
      }
    });

    it('Error when password does not contain a letter', async () => {
      const inputPasswordNoLetter: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: '1234567',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputPasswordNoLetter);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_01',
          message: 'Password must contain at least one letter.',
          details:
            'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
        });
      }
    });
    it('Error when password is less than 6 characters and does not contain a digit', async () => {
      const inputPasswordLessThan6NoDigit: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: 'coxi',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputPasswordLessThan6NoDigit);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_01',
          message: 'Password must be at least 6 characters long. Password must contain at least one digit.',
          details:
            'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
        });
      }
    });
    it('Error when password is less than 6 characters and does not contain a letter', async () => {
      const inputPasswordLessThan6NoLetter: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: '1234',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputPasswordLessThan6NoLetter);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_01',
          message: 'Password must be at least 6 characters long. Password must contain at least one letter.',
          details:
            'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
        });
      }
    });
    it('Error when password does not contain a letter and does not contain a digit', async () => {
      const inputPasswordNoLetterNoDigit: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: '!!!!!!!!',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputPasswordNoLetterNoDigit);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_01',
          message: 'Password must contain at least one letter. Password must contain at least one digit.',
          details:
            'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
        });
      }
    });
    it('Error when password is less than 6 characters and does not contain a letter and does not contain a digit', async () => {
      const inputPasswordAllInvalid: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabi@gmail.com',
        password: '!!!',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputPasswordAllInvalid);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_01',
          message:
            'Password must be at least 6 characters long. Password must contain at least one letter. Password must contain at least one digit.',
          details:
            'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
        });
      }
    });
    it('Error when email is invalid', async () => {
      const inputEmailInvalid: UserCreateReq = {
        name: 'Gabrielle',
        email: 'gabriellegmail.com',
        password: 'coxinha123',
        birthDate: '02-12-2000',
      };
      try {
        await endpoint.post('/users', inputEmailInvalid);
      } catch (error: any) {
        expect(error.response.status).to.be.deep.eq(400);
        expect(error.response.data).to.be.deep.eq({
          code: 'USR_02',
          message: 'Invalid email address',
          details: 'Invalid email. Please check if you entered the email correctly.',
        });
      }
    });
  });
});

after(async () => {
  await prismaInstance.$disconnect();
  await closeServer();
});
