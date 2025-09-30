import jwt from 'jsonwebtoken';

const secret = String(process.env.SECRET_JWT);

export default function generateTokenTest(userId: string, rememberMe: boolean = false) {
  const timeExpire = rememberMe ? '7d' : '1h';
  return jwt.sign({ id: userId }, secret, { expiresIn: timeExpire });
}
