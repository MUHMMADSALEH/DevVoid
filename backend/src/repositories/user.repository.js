import { User } from '../models/user.model.js';
import { AppError } from '../middleware/errorHandler.js';

export class UserRepository {
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new AppError('Failed to create user', 500);
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new AppError('Failed to find user', 500);
    }
  }

  async findByEmailWithPassword(email) {
    try {
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      throw new AppError('Failed to find user', 500);
    }
  }

  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new AppError('Failed to find user', 500);
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
} 