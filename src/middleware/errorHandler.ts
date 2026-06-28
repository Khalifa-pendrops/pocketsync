import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}


export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  // Log full error server-side
  console.error(`[ERROR] ${err.message}`, process.env.NODE_ENV === 'development' ? err.stack : '');


  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : statusCode === 500
        ? 'Internal server error'
        : err.message,
  });
};
