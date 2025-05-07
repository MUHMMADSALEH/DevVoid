import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AppError } from './errorHandler.js';
import { UserRepository } from '../repositories/user.repository.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('No authorization header', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    if (!decoded || !decoded.id) {
      throw new AppError('Invalid token', 401);
    }

    // Get user email from database
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = { id: decoded.id, email: user.email };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
}; 