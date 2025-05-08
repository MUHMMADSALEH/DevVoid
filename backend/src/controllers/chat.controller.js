import { ChatRepository } from '../repositories/chat.repository.js';
import { GeminiService } from '../services/gemini.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export class ChatController {
  constructor() {
    this.chatRepository = new ChatRepository();
    this.geminiService = new GeminiService();
  }

  createChat = async (req, res, next) => {
    try {
      const { title } = req.body;
      const userId = req.user._id;

      const chat = await this.chatRepository.create({
        user: userId,
        title,
        messages: [],
      });

      res.status(201).json({
        status: 'success',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  getChats = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const chats = await this.chatRepository.findByUserId(userId);

      res.status(200).json({
        status: 'success',
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  };

  getChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.user.toString() !== userId.toString()) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      res.status(200).json({
        status: 'success',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      // Get chat and verify ownership
      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.user.toString() !== userId.toString()) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      // Add user message
      const userMessage = {
        content,
        role: 'user',
      };
      await this.chatRepository.addMessage(chatId, userMessage);

      // Generate AI response
      const aiResponse = await this.geminiService.generateResponse(content);
      const mood = await this.geminiService.analyzeMood(content);

      // Add AI message
      const assistantMessage = {
        content: aiResponse,
        role: 'assistant',
        mood,
      };
      const updatedChat = await this.chatRepository.addMessage(chatId, assistantMessage);

      res.status(200).json({
        status: 'success',
        data: updatedChat,
      });
    } catch (error) {
      next(error);
    }
  };

  updateChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { title } = req.body;
      const userId = req.user._id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.user.toString() !== userId.toString()) {
        throw new AppError('Not authorized to update this chat', 403);
      }

      const updatedChat = await this.chatRepository.update(chatId, { title });

      res.status(200).json({
        status: 'success',
        data: updatedChat,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.user.toString() !== userId.toString()) {
        throw new AppError('Not authorized to delete this chat', 403);
      }

      await this.chatRepository.delete(chatId);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.user.toString() !== userId.toString()) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      const messages = chat.messages.map(msg => msg.content);
      const summary = await this.geminiService.generateSummary(messages);

      const updatedChat = await this.chatRepository.update(chatId, { summary });

      res.status(200).json({
        status: 'success',
        data: updatedChat,
      });
    } catch (error) {
      next(error);
    }
  };

  getInsights = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.user.toString() !== userId.toString()) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      const messages = chat.messages.map(msg => msg.content);
      const insights = await this.geminiService.generateInsights(messages);

      const updatedChat = await this.chatRepository.update(chatId, { insights });

      res.status(200).json({
        status: 'success',
        data: updatedChat,
      });
    } catch (error) {
      next(error);
    }
  };
} 