import { hashPassword } from '../../src/utils/hash';

(async function hash() {
  try {
    const password = await hashPassword('coxinha123');
    console.log(password);
  } catch (error) {
    console.log(error);
  }
})();
