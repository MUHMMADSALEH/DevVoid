import expressValidator from 'express-validator';
const { validationResult } = expressValidator;
import { AppError } from './errorHandler.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => {
      // Handle nested field errors
      const field = error.path.split('.').pop();
      return `${field}: ${error.msg}`;
    });
    throw new AppError(errorMessages.join(', '), 400);
  }
  next();
}; 