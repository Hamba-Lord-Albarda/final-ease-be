import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../../config/logger';
import { env } from '../../config/env';
import { MulterError } from 'multer';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  else if (err instanceof MulterError) {
    statusCode = 400;

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File terlalu besar';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Field file tidak sesuai';
        break;
      default:
        message = 'Gagal memproses file upload';
    }
  }

  else if (err instanceof SyntaxError && 'body' in (err as any)) {
    statusCode = 400;
    message = 'Payload JSON tidak valid';
  }

  else if (err instanceof Error) {
    if (env.nodeEnv === 'development') {
      message = err.message || message;
    }
  }

  logger.error('Request failed', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    errorName: (err as any)?.name,
    errorMessage: (err as any)?.message,
    stack: (err as any)?.stack
  });

  const responseBody: Record<string, unknown> = {
    success: false,
    message
  };

  if (env.nodeEnv === 'development') {
    responseBody.error = {
      name: (err as any)?.name,
      stack: (err as any)?.stack
    };
  }

  res.status(statusCode).json(responseBody);
}
