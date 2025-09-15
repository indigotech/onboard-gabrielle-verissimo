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
