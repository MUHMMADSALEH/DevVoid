import { Chat, IChat, IMessage } from '../models/chat.model.js';
import { AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

export class ChatRepository {
  async create(userId: string): Promise<IChat> {
    try {
      const chat = new Chat({ userId, messages: [] });
      return await chat.save();
    } catch (error) {
      if (error instanceof mongoose.Error) {
        throw new AppError('Invalid chat data', 400);
      }
      throw new AppError('Failed to create chat', 500);
    }
  }

  async findById(id: string): Promise<IChat | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid chat ID', 400);
      }
      return await Chat.findById(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to find chat', 500);
    }
  }

  async findByUserId(userId: string): Promise<IChat[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError('Invalid user ID', 400);
      }
      return await Chat.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new AppError('Failed to fetch chat history', 500);
    }
  }

  async addMessage(chatId: string, message: IMessage): Promise<IChat | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError('Invalid chat ID', 400);
      }
      return await Chat.findByIdAndUpdate(
        chatId,
        { $push: { messages: message } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to add message', 500);
    }
  }

  async updateSummary(chatId: string, summary: string): Promise<IChat | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError('Invalid chat ID', 400);
      }
      return await Chat.findByIdAndUpdate(
        chatId,
        { summary },
        { new: true }
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update summary', 500);
    }
  }

  async delete(chatId: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError('Invalid chat ID', 400);
      }
      const result = await Chat.findByIdAndDelete(chatId);
      return !!result;
    } catch (error) {
      throw new AppError('Failed to delete chat', 500);
    }
  }

  async getRecentChats(userId: string, limit: number = 10): Promise<IChat[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError('Invalid user ID', 400);
      }
      return await Chat.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw new AppError('Failed to fetch recent chats', 500);
    }
  }
} 