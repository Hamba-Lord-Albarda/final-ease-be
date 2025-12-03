import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}
