import { UserJwtPayloadType } from '@/types/user';
import jwt from 'jsonwebtoken';

const secretKey = process.env.NEXTAUTH_SECRET as string;

export function generateToken(payload: UserJwtPayloadType) {
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  return token;
}
