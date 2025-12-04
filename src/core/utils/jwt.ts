import jwt, { SignOptions, JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-jwt-default';

export interface JwtPayload extends BaseJwtPayload {
  id?: number;
  email: string;
  role: string;
}

export const generateToken = (payload: { id?: number; sub?: number; email: string; role: string }): string => {
  const options: SignOptions = {
    expiresIn: '7d'
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded as JwtPayload;
};

export const signJwt = generateToken;
export const verifyJwt = verifyToken;
