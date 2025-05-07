import { User, IUser } from '../models/user.model.js';
import { AppError } from '../middleware/errorHandler.js';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new AppError('Email already exists', 400);
      }
      throw new AppError('Failed to create user', 500);
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new AppError('Failed to find user', 500);
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new AppError('Failed to find user', 500);
    }
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
} 