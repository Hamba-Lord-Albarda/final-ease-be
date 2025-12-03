import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../utils/jwt';
import { AppError } from '../errors/AppError';

// pake jwt token
export function authGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload: JwtPayload = verifyJwt(token);
    (req as any).auth = payload;
    next();
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
}
