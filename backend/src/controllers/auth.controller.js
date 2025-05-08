import { AuthService } from '../services/auth.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const { user } = req.body;
      if (!user || !user.email || !user.password || !user.name) {
        throw new AppError('Invalid registration data', 400);
      }

      logger.info('Registering new user:', user.email);
      const result = await this.authService.register(user.email, user.password, user.name);

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { user } = req.body;
      if (!user || !user.email || !user.password) {
        throw new AppError('Invalid login credentials', 400);
      }

      logger.info('Logging in user:', user.email);
      const result = await this.authService.login(user.email, user.password);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  };

  verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError('No token provided', 401);
      }

      const decoded = this.authService.verifyToken(token);
      res.status(200).json({
        status: 'success',
        data: { userId: decoded.id },
      });
    } catch (error) {
      next(error);
    }
  };
} 