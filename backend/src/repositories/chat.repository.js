import { Chat } from '../models/chat.model.js';
import { AppError } from '../middleware/errorHandler.js';

export class ChatRepository {
  async create(chatData) {
    try {
      const chat = new Chat(chatData);
      return await chat.save();
    } catch (error) {
      throw new AppError('Failed to create chat', 500);
    }
  }

  async findById(id) {
    try {
      return await Chat.findById(id);
    } catch (error) {
      throw new AppError('Failed to find chat', 500);
    }
  }

  async findByUserId(userId) {
    try {
      return await Chat.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new AppError('Failed to find chats', 500);
    }
  }

  async addMessage(chatId, message) {
    try {
      return await Chat.findByIdAndUpdate(
        chatId,
        { $push: { messages: message } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateMessage(chatId, messageId, updateData) {
    try {
      return await Chat.findOneAndUpdate(
        { _id: chatId, 'messages._id': messageId },
        { $set: { 'messages.$': updateData } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(chatId, messageId) {
    try {
      return await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { messages: { _id: messageId } } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Chat.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new AppError('Failed to update chat', 500);
    }
  }

  async delete(id) {
    try {
      return await Chat.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError('Failed to delete chat', 500);
    }
  }

  async getRecentChats(userId, limit = 10) {
    try {
      return await Chat.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async getChatsByDateRange(userId, startDate, endDate) {
    try {
      return await Chat.find({
        user: userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }
} 