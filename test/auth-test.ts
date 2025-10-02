import { expect } from 'chai';
import { endpoint } from './utils/config-test';
import jwt from 'jsonwebtoken';

const inputLogin = {
  email: 'gabi@gmail.com',
  password: 'coxinha123',
  rememberMe: true,
};

const userLogged = {
  id: 'df59e650-f751-4c1c-a991-61b9b798a5f9',
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  birthDate: '02-12-2000',
};

const payloadId = 'df59e650-f751-4c1c-a991-61b9b798a5f9';

describe('Auth user endpoint', () => {
  it('Response and auth success', async () => {
    const response = await endpoint.post('/auth', inputLogin);

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
        details: 'Email or password incorrect. Try again.',
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
        code: 'USR_04',
        message: 'Login fail',
        details: 'Email or password incorrect. Try again.',
      };
      const response = await endpoint.post('/auth', loginPasswordError);
      expect(response.status).to.be.deep.eq(400);
      expect(response.data).to.be.deep.eq(errorWrongPassword);
    });
  });
});
