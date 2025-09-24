import * as argon2 from 'argon2';

export async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    console.log(error);
    return 'erro no hash da senha';
  }
}

export async function verifyPassword(hash: string, password: string) {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return false;
}
