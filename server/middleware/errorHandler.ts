import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, any>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'An account with that email already exists.';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val: any) => val.message);
    message = messages.join('. ');
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier provided.';
  }

  console.error(`[Error ${statusCode}] ${req.method} ${req.url}:`, message);

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
