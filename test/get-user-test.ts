import { expect } from 'chai';
import { endpoint } from './utils/config-test';
import generateTokenTest from './utils/generate-token-test';

const userGet = {
  id: '9a3ab3db-6488-4b21-85c4-f625a36139fd',
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  birthDate: '02-12-2000',
  address: [
    {
      id: '34854552-dc9f-4c52-91a6-ef97e5b9c0d2',
      cep: '01310-000',
      street: 'Avenida Paulista',
      streetNumber: '1000',
      complement: '',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      userId: '9a3ab3db-6488-4b21-85c4-f625a36139fd',
    },
    {
      id: '56da9f49-572e-462e-8a79-69ab622fedeb',
      cep: '98399-464',
      street: 'Rua Enzo Gabriel',
      streetNumber: '41916',
      complement: 'Casa 4',
      neighborhood: 'Borders',
      city: 'Costa do Descoberto',
      state: 'São Paulo',
      userId: '9a3ab3db-6488-4b21-85c4-f625a36139fd',
    },
  ],
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
    expect(response.data.id).to.be.eq(userGet.id);
    expect(response.data.name).to.be.eq(userGet.name);
    expect(response.data.email).to.be.eq(userGet.email);
    expect(response.data.birthDate).to.be.eq(userGet.birthDate);
    expect(response.data.address).to.have.lengthOf(userGet.address.length);

    response.data.address.forEach((addr: any, idx: number) => {
      expect(addr.cep).to.be.eq(userGet.address[idx].cep);
      expect(addr.street).to.be.eq(userGet.address[idx].street);
      expect(addr.streetNumber).to.be.eq(userGet.address[idx].streetNumber);
      expect(addr.complement).to.be.eq(userGet.address[idx].complement);
      expect(addr.neighborhood).to.be.eq(userGet.address[idx].neighborhood);
      expect(addr.city).to.be.eq(userGet.address[idx].city);
      expect(addr.state).to.be.eq(userGet.address[idx].state);
      expect(addr.userId).to.be.eq(userGet.id);
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
      code: 'USR_05',
      message: 'User not found',
      details: 'No user was found with that ID.',
    });
  });
});
