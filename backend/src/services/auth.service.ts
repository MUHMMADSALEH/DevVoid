import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import { IUser } from '../models/user.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

interface TokenPayload extends JwtPayload {
  id: string;
}

export class AuthService {
  private userRepository: UserRepository;
  private JWT_SECRET: Buffer;
  private JWT_EXPIRES_IN: number;

  constructor() {
    this.userRepository = new UserRepository();
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_SECRET = Buffer.from(secret, 'utf-8');
    // Convert expiration time to seconds (default: 24 hours)
    this.JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10);
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Create user (password will be hashed by the model's pre-save hook)
      const user = await this.userRepository.create({
        email,
        password,
        name,
      });

      if (!user || !user._id) {
        throw new AppError('Failed to create user', 500);
      }

      // Generate token
      const token = this.generateToken(user._id.toString());

      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to register user', 500);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      logger.info('Attempting login for email:', email);

      // Find user
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user._id) {
        logger.error('User not found for email:', email);
        throw new AppError('Invalid credentials', 401);
      }

      logger.info('User found, comparing passwords');

      // Check password using the model's comparePassword method
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logger.error('Password mismatch for user:', email);
        throw new AppError('Invalid credentials', 401);
      }

      logger.info('Password matched, generating token');

      // Generate token
      const token = this.generateToken(user._id.toString());

      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Login error:', error);
      throw new AppError('Failed to login', 500);
    }
  }

  private generateToken(userId: string): string {
    if (!this.JWT_SECRET) {
      throw new AppError('JWT secret is not configured', 500);
    }

    try {
      const options: SignOptions = { expiresIn: this.JWT_EXPIRES_IN };
      return jwt.sign({ id: userId }, this.JWT_SECRET, options);
    } catch (error) {
      throw new AppError('Failed to generate token', 500);
    }
  }

  verifyToken(token: string): TokenPayload {
    if (!this.JWT_SECRET) {
      throw new AppError('JWT secret is not configured', 500);
    }

    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
} 