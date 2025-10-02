import { expect } from 'chai';
import { endpoint } from './utils/config-test';
import generateTokenTest from './utils/generate-token-test';
import { UserCreateRep } from '../src/user/user.model';

const token = `Bearer ${generateTokenTest('1ae35424-d800-4001-873a-d0cc3597ee2a', true)}`;

describe('List users endpoint', () => {
  it('Response and list with limit 30', async () => {
    const response = await endpoint.get('/users/list?take=30', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.property('total');
    expect(response.data).to.have.property('previous');
    expect(response.data).to.have.property('next');
    expect(response.data).to.have.property('users');
    response.data.users.forEach((user: UserCreateRep) => {
      expect(user).to.have.all.keys(['id', 'name', 'email', 'birthDate']);
    });
    expect(response.data.users).to.have.lengthOf(30);
  });
  it('Response and list without limit', async () => {
    const response = await endpoint.get('/users/list', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.property('total');
    expect(response.data).to.have.property('previous');
    expect(response.data).to.have.property('next');
    expect(response.data).to.have.property('users');
    response.data.users.forEach((user: UserCreateRep) => {
      expect(user).to.have.all.keys(['id', 'name', 'email', 'birthDate']);
    });
    expect(response.data.users).to.have.lengthOf(20);
  });
  it('Response and list with skip 2 and limit 5', async () => {
    const response = await endpoint.get('/users/list?skip=2&take=5', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.property('total');
    expect(response.data).to.have.property('previous');
    expect(response.data).to.have.property('next');
    expect(response.data).to.have.property('users');
    response.data.users.forEach((user: UserCreateRep) => {
      expect(user).to.have.all.keys(['id', 'name', 'email', 'birthDate']);
    });
    expect(response.data.users).to.have.lengthOf(5);
  });
  it('Response and list with skip negative and limit negative', async () => {
    const response = await endpoint.get('/users/list?skip=-2&take=-5', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.property('total');
    expect(response.data).to.have.property('previous');
    expect(response.data).to.have.property('next');
    expect(response.data).to.have.property('users');
    response.data.users.forEach((user: UserCreateRep) => {
      expect(user).to.have.all.keys(['id', 'name', 'email', 'birthDate']);
    });
    expect(response.data.users).to.have.lengthOf(20);
  });
  it('Response and list with skip NaN and limit NaN', async () => {
    const response = await endpoint.get('/users/list?skip=abc&take=def', {
      headers: {
        Authorization: token,
      },
    });
    expect(response.status).to.be.deep.eq(200);
    expect(response.data).to.have.property('total');
    expect(response.data).to.have.property('previous');
    expect(response.data).to.have.property('next');
    expect(response.data).to.have.property('users');
    response.data.users.forEach((user: UserCreateRep) => {
      expect(user).to.have.all.keys(['id', 'name', 'email', 'birthDate']);
    });
    expect(response.data.users).to.have.lengthOf(20);
  });
});
