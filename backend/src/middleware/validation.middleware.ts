import { Request, Response, NextFunction } from 'express';
import expressValidator from 'express-validator';
const validator = expressValidator as any;
const { validationResult } = validator;
import { AppError } from './errorHandler.js';
import { logger } from '../utils/logger.js';

export const validateRequest = (validations: any[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      logger.info('Validating request:', {
        body: req.body,
        headers: req.headers,
        path: req.path
      });

      // Handle nested user object
      if (req.body.user) {
        req.body = { ...req.body.user };
      }

      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        logger.info('Validation passed');
        return next();
      }

      // Pass the original validation errors to AppError
      const validationErrors = errors.array();
      logger.error('Validation failed:', {
        errors: validationErrors,
        body: req.body
      });

      next(new AppError('Validation failed', 400, validationErrors));
    } catch (error) {
      logger.error('Validation error:', error);
      next(error);
    }
  };
}; 