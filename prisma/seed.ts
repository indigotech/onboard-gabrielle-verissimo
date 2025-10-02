import { faker } from '@faker-js/faker';
import prismaInstance from '../src/db';
import { hashPassword } from '../src/utils/hash';

const prisma = prismaInstance;

faker.seed(123);

function createRandomUser() {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toLocaleDateString('pt-BR').replace(/\//g, '-'),
  };
}

export const users = faker.helpers.multiple(createRandomUser, { count: 50 });

async function seed() {
  try {
    const promises = users.map(async user => {
      const hashedPassword = await hashPassword(user.password);
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          birthDate: user.birthdate,
        },
      });
    });
    await Promise.all(promises);
    console.log('Database seeded');

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}

seed().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
