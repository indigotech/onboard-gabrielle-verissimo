import { seed } from '../../prisma/seed';
import prismaInstance from '../../src/db';
import { create } from '../../src/user/user.service';

const user = {
  name: 'Gabrielle',
  email: 'gabi@gmail.com',
  password: 'coxinha123',
  birthDate: '02-12-2000',
  address: [
    {
      cep: '01310-000',
      street: 'Avenida Paulista',
      streetNumber: '1000',
      complement: '',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      cep: '98399-464',
      street: 'Rua Enzo Gabriel',
      streetNumber: '41916',
      complement: 'Casa 4',
      neighborhood: 'Borders',
      city: 'Costa do Descoberto',
      state: 'São Paulo',
    },
  ],
};

async function seedTest() {
  try {
    await seed();
    await create(user);
  } catch (error) {
    console.error(error);
  }
}

seedTest()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prismaInstance.$disconnect();
  });
