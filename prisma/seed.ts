import { fakerPT_BR as faker } from '@faker-js/faker';
import prismaInstance from '../src/db';
import { create } from '../src/user/user.service';

const prisma = prismaInstance;

faker.seed(123);

const randomDigit = Math.floor(Math.random() * 10);

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

function createRandomUser() {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: `${faker.internet.password()}${randomDigit}${randomLetter}`,
    birthDate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toLocaleDateString('pt-BR').replace(/\//g, '-'),
    address: [
      {
        cep: faker.location.zipCode('#####-###'),
        street: faker.location.street(),
        streetNumber: faker.location.buildingNumber(),
        complement: faker.location.secondaryAddress(),
        neighborhood: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state(),
      },
      {
        cep: faker.location.zipCode('#####-###'),
        street: faker.location.street(),
        streetNumber: faker.location.buildingNumber(),
        complement: faker.location.secondaryAddress(),
        neighborhood: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state(),
      },
    ],
  };
}
export const users = faker.helpers.multiple(createRandomUser, { count: 50 });

export async function seed() {
  try {
    await Promise.all(
      users.map(async user => {
        await create(user);
      }),
    );
    console.log('Database seeded');
  } catch (error) {
    console.log(error);
  }
}

seed()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
