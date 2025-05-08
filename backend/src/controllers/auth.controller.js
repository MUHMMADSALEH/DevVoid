import { AuthService } from '../services/auth.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.register(email, password, name);

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
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