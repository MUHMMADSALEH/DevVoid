import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from './errorHandler.js';
import { logger } from '../utils/logger.js';

const userRepository = new UserRepository();

export const protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized to access this route', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // 3) Check if user still exists
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // 4) Add user to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
}; 