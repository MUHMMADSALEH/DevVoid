import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ValidationError } from 'express-validator';

interface ValidationErrorResponse {
  errors: ValidationError[];
}

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errors?: ValidationError[];

  constructor(message: string, statusCode: number, errors?: ValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error('Operational error:', {
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString()
    });
  }

  // Handle validation errors from express-validator
  if (err.name === 'ValidationError' && 'errors' in err) {
    const validationError = err as Error & ValidationErrorResponse;
    logger.error('Validation error:', validationError);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: validationError.errors,
      timestamp: new Date().toISOString()
    });
  }

  logger.error('Programming error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString()
  });
}; 