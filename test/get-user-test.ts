import { expect } from 'chai';
import { endpoint } from './utils/config-test';
import generateTokenTest from './utils/generate-token-test';

const userGet = {
  id: 'df59e650-f751-4c1c-a991-61b9b798a5f9',
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  birthDate: '02-12-2000',
};

const token = `Bearer ${generateTokenTest('1ae35424-d800-4001-873a-d0cc3597ee2a', true)}`;

describe('Get user endpoint', () => {
  it('Response and get sucess', async () => {
    const response = await endpoint.get(`/users/${userGet.id}`, {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.be.deep.eq({
      id: userGet.id,
      name: userGet.name,
      email: userGet.email,
      birthDate: userGet.birthDate,
    });
  });

  it('Error: id wrong', async () => {
    const response = await endpoint.get('/users/f59e650', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(404);
    expect(response.data).to.be.deep.eq({
      code: 'USR_06',
      message: 'User not found',
      details: 'No user was found with that ID.',
    });
  });
});
