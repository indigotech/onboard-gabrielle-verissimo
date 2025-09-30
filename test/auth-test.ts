import { expect } from 'chai';
import prismaInstance from '../src/db';
import { endpoint } from './utils/config-test';
import jwt from 'jsonwebtoken';

const inputLogin = {
  email: 'gabi@gmail.com',
  password: 'coxinha123',
  rememberMe: true,
};

const payloadId = 'df59e650-f751-4c1c-a991-61b9b798a5f9';

describe('Auth user endpoint', () => {
  it('Response and auth success', async () => {
    const response = await endpoint.post('/auth', inputLogin);
    const userLogged = (await prismaInstance.user.findUnique({
      where: {
        email: inputLogin.email,
      },
    }))!;
    expect(response.status).to.be.deep.eq(200);
    expect(response.data.user).to.be.deep.eq({
      id: userLogged.id,
      name: userLogged.name,
      email: userLogged.email,
      birthDate: userLogged.birthDate,
    });
    expect(response.data).to.have.property('token');
    const payload = jwt.verify(response.data.token.split(' ')[1], String(process.env.SECRET_JWT));
    expect(payload.id).to.be.deep.eq(payloadId);
  });

  describe('Auth error', () => {
    it('Wrong email', async () => {
      const loginEmailError = {
        email: 'jub@gmail.com',
        password: 'coxinha123',
      };
      const errorWrongEmail = {
        code: 'USR_04',
        message: 'Login fail',
        details:
          'No user was found with that email. Please check if you entered the correct email address or register.',
      };
      const response = await endpoint.post('/auth', loginEmailError);
      expect(response.status).to.be.deep.eq(400);
      expect(response.data).to.be.deep.eq(errorWrongEmail);
    });
    it('Wrong password', async () => {
      const loginPasswordError = {
        email: 'gabi@gmail.com',
        password: 'coxinha23',
      };
      const errorWrongPassword = {
        code: 'USR_05',
        message: 'Login fail',
        details: 'Incorrect password. Try again.',
      };
      const response = await endpoint.post('/auth', loginPasswordError);
      expect(response.status).to.be.deep.eq(400);
      expect(response.data).to.be.deep.eq(errorWrongPassword);
    });
  });
});
