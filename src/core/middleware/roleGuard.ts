import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function roleGuard(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth;

    if (!auth) {
      throw new AppError('Unauthorized', 401);
    }

    const userRole = auth.role as string;

    if (!allowedRoles.includes(userRole)) {
      throw new AppError('Forbidden. Insufficient role', 403);
    }

    next();
  };
}
