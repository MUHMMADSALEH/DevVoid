import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Register request received:', { body: req.body });
      const { email, password, name } = req.body;
      const result = await this.authService.register(email, password, name);
      
      logger.info('Registration successful:', { email });
      
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          },
          token: result.token,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Login request received:', { body: req.body });
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      
      logger.info('Login successful:', { email });
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          },
          token: result.token,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  };
} 