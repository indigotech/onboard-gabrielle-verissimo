import { expect } from 'chai';
import { endpoint } from './utils/config-test';
import generateTokenTest from './utils/generate-token-test';

const token = `Bearer ${generateTokenTest('1ae35424-d800-4001-873a-d0cc3597ee2a', true)}`;

describe('List users endpoint', () => {
  it('Response and list with limit 30', async () => {
    const response = await endpoint.get('/users/list/30', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.length(30);
  });
  it('Response and list without limit', async () => {
    const response = await endpoint.get('/users/list/20', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.length(20);
  });
});
