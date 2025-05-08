import { Chat } from '../models/chat.model.js';

export class ChatRepository {
  async create(chatData) {
    try {
      const chat = new Chat(chatData);
      return await chat.save();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Chat.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await Chat.find({ user: userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
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

  async update(chatId, updateData) {
    try {
      return await Chat.findByIdAndUpdate(chatId, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async delete(chatId) {
    try {
      return await Chat.findByIdAndDelete(chatId);
    } catch (error) {
      throw error;
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