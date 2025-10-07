import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { endpoint } from './utils/config-test';

const inputLogin = {
  email: 'gabi@gmail.com',
  password: 'coxinha123',
  rememberMe: true,
};

const userLogged = {
  id: '9a3ab3db-6488-4b21-85c4-f625a36139fd',
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  birthDate: '02-12-2000',
};

const loginPasswordError = {
  email: 'gabi@gmail.com',
  password: 'coxinha23',
};
const errorWrongPassword = {
  code: 'USR_04',
  message: 'Login fail',
  details: 'Email or password incorrect. Try again.',
};
const loginEmailError = {
  email: 'jub@gmail.com',
  password: 'coxinha123',
};
const errorWrongEmail = {
  code: 'USR_04',
  message: 'Login fail',
  details: 'Email or password incorrect. Try again.',
};

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
    expect(payload.id).to.be.deep.eq(response.data.user.id);
  });

  describe('Auth error', () => {
    it('Wrong email', async () => {
      const response = await endpoint.post('/auth', loginEmailError);
      expect(response.status).to.be.deep.eq(400);
      expect(response.data).to.be.deep.eq(errorWrongEmail);
    });

    it('Wrong password', async () => {
      const response = await endpoint.post('/auth', loginPasswordError);
      expect(response.status).to.be.deep.eq(400);
      expect(response.data).to.be.deep.eq(errorWrongPassword);
    });
  });
});
