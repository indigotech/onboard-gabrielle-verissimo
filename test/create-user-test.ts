import { expect } from 'chai';
import prismaInstance from '../src/db';
import { UserCreateReq } from '../src/user/user.model';
import { verifyPassword } from '../src/utils/hash';
import { endpoint } from './utils/config-test';
import generateTokenTest from './utils/generate-token-test';

const token = `Bearer ${generateTokenTest('1ae35424-d800-4001-873a-d0cc3597ee2a', true)}`;

const inputCreateUser: UserCreateReq = {
  name: 'João',
  email: 'joao@gmail.com',
  password: 'senha123',
  birthDate: '09-09-2001',
};

const errorJwt = {
  code: 'USR_10',
  message: 'authentication failure',
  details: 'Invalid Token',
};

const inputEmailExists: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxinha123',
  birthDate: '02-12-2000',
};

const inputPasswordWithoutDigit: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxinha',
  birthDate: '02-12-2000',
};

const inputPasswordLessThan6: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxi1',
  birthDate: '02-12-2000',
};

const inputPasswordNoLetter: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: '1234567',
  birthDate: '02-12-2000',
};

const inputPasswordLessThan6NoDigit: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxi',
  birthDate: '02-12-2000',
};

const inputPasswordLessThan6NoLetter: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: '1234',
  birthDate: '02-12-2000',
};

const inputPasswordNoLetterNoDigit: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: '!!!!!!!!',
  birthDate: '02-12-2000',
};

const inputPasswordAllInvalid: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: '!!!',
  birthDate: '02-12-2000',
};

const inputEmailInvalid: UserCreateReq = {
  name: 'Gabrielle',
  email: 'gabriellegmail.com',
  password: 'coxinha123',
  birthDate: '02-12-2000',
};

describe('Create user endpoint', () => {
  it('Response and create success', async () => {
    const response = await endpoint.post('/users', inputCreateUser, {
      headers: {
        Authorization: token,
      },
    });
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
    it('Error when jwt is invalid', async () => {
      const response = await endpoint.post('/users', inputCreateUser, {
        headers: {
          Authorization: '12344jajaja',
        },
      });
      expect(response.status).to.be.deep.eq(401);
      expect(response.data).to.be.deep.eq(errorJwt);
    });
  });

  it('Error when email already exists', async () => {
    const response = await endpoint.post('/users', inputEmailExists, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_03',
      message: 'Invalid credential',
      details: 'There is already a user registered with this email. Please provide a different email address.',
    });
  });

  describe('Password invalid', () => {
    it('Error when password does not contain a digit', async () => {
      const response = await endpoint.post('/users', inputPasswordWithoutDigit, {
        headers: {
          Authorization: token,
        },
      });
      expect(response.status).to.be.deep.eq(400);
      expect(response.data).to.be.deep.eq({
        code: 'USR_01',
        message: 'Password must contain at least one digit.',
        details:
          'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
      });
    });
  });

  it('Error when password is less than 6 characters', async () => {
    const response = await endpoint.post('/users', inputPasswordLessThan6, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_01',
      message: 'Password must be at least 6 characters long.',
      details:
        'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    });
  });

  it('Error when password does not contain a letter', async () => {
    const response = await endpoint.post('/users', inputPasswordNoLetter, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_01',
      message: 'Password must contain at least one letter.',
      details:
        'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    });
  });

  it('Error when password is less than 6 characters and does not contain a digit', async () => {
    const response = await endpoint.post('/users', inputPasswordLessThan6NoDigit, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_01',
      message: 'Password must be at least 6 characters long. Password must contain at least one digit.',
      details:
        'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    });
  });

  it('Error when password is less than 6 characters and does not contain a letter', async () => {
    const response = await endpoint.post('/users', inputPasswordLessThan6NoLetter, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_01',
      message: 'Password must be at least 6 characters long. Password must contain at least one letter.',
      details:
        'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    });
  });

  it('Error when password does not contain a letter and does not contain a digit', async () => {
    const response = await endpoint.post('/users', inputPasswordNoLetterNoDigit, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_01',
      message: 'Password must contain at least one letter. Password must contain at least one digit.',
      details:
        'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    });
  });

  it('Error when password is less than 6 characters and does not contain a letter and does not contain a digit', async () => {
    const response = await endpoint.post('/users', inputPasswordAllInvalid, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_01',
      message:
        'Password must be at least 6 characters long. Password must contain at least one letter. Password must contain at least one digit.',
      details:
        'The password must contain at least 6 characters and among them there must be at least 1 letter and 1 digit.',
    });
  });

  it('Error when email is invalid', async () => {
    const response = await endpoint.post('/users', inputEmailInvalid, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(400);
    expect(response.data).to.be.deep.eq({
      code: 'USR_02',
      message: 'Invalid email address',
      details: 'Invalid email. Please check if you entered the email correctly.',
    });
  });
});
