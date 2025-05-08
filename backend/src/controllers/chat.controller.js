import { ChatRepository } from '../repositories/chat.repository.js';
import { GeminiService } from '../services/gemini.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export class ChatController {
  constructor() {
    this.chatRepository = new ChatRepository();
    this.geminiService = new GeminiService();
  }

  getChats = async (req, res, next) => {
    try {
      const userId = req.user.id;
      logger.info('Fetching all chats for user:', userId);

      const chats = await this.chatRepository.findByUserId(userId);
      
      res.status(200).json({
        status: 'success',
        data: { chats },
      });
    } catch (error) {
      logger.error('Error fetching chats:', error);
      next(error);
    }
  };

  getChatHistory = async (req, res, next) => {
    try {
      const userId = req.user.id;
      logger.info('Fetching chat history for user:', userId);

      const chats = await this.chatRepository.findByUserId(userId);
      
      res.status(200).json({
        status: 'success',
        data: { chats },
      });
    } catch (error) {
      logger.error('Error fetching chat history:', error);
      next(error);
    }
  };

  createChat = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const initialMessage = req.body.message || "Hello! I'm your AI assistant. How can I help you today?";

      logger.info('Creating new chat for user:', userId);

      // Create chat with initial message
      const chat = await this.chatRepository.create({
        userId,
        title: 'New Chat', // Initial title
        messages: [{
          content: initialMessage,
          sender: 'user',
          timestamp: new Date().toISOString(),
          mood: 'neutral'
        }],
      });

      // Get AI response
      const response = await this.geminiService.generateResponse(initialMessage);

      // Add AI response
      chat.messages.push({
        content: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        mood: 'neutral'
      });

      // Generate title based on the conversation
      chat.title = await this.geminiService.generateTitle(chat.messages);
      await chat.save();

      logger.info('Chat created successfully:', chat._id);

      res.status(201).json({
        status: 'success',
        data: { chat },
      });
    } catch (error) {
      logger.error('Error creating chat:', error);
      next(error);
    }
  };

  getChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      res.status(200).json({
        status: 'success',
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content) {
        throw new AppError('Message content is required', 400);
      }

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      // Add user message
      chat.messages.push({
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        mood: 'neutral'
      });
      await chat.save();

      // Get AI response
      const response = await this.geminiService.generateResponse(content);

      // Add AI response
      chat.messages.push({
        content: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        mood: 'neutral'
      });

      // Update title if this is one of the first few messages
      if (chat.messages.length <= 6) {
        chat.title = await this.geminiService.generateTitle(chat.messages);
      }
      await chat.save();

      res.status(200).json({
        status: 'success',
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  };

  updateChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { message } = req.body;
      const userId = req.user.id;

      if (!message) {
        throw new AppError('Message is required', 400);
      }

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to update this chat', 403);
      }

      // Add user message
      chat.messages.push({
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        mood: 'neutral'
      });

      // Get AI response
      const response = await this.geminiService.generateResponse(message);

      // Add AI response
      chat.messages.push({
        content: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        mood: 'neutral'
      });
      await chat.save();

      res.status(200).json({
        status: 'success',
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to delete this chat', 403);
      }

      await this.chatRepository.delete(chatId);

      res.status(200).json({
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
      const userId = req.user.id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      const summary = await this.geminiService.generateSummary(chat.messages);

      res.status(200).json({
        status: 'success',
        data: { summary },
      });
    } catch (error) {
      next(error);
    }
  };

  getMotivation = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      const motivation = await this.geminiService.generateMotivation(chat.messages);

      res.status(200).json({
        status: 'success',
        data: { motivation },
      });
    } catch (error) {
      next(error);
    }
  };

  getImprovements = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      const improvements = await this.geminiService.generateImprovements(chat.messages);

      res.status(200).json({
        status: 'success',
        data: { improvements },
      });
    } catch (error) {
      next(error);
    }
  };

  getInsights = async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Check if chat belongs to user
      if (chat.userId.toString() !== userId) {
        throw new AppError('Not authorized to access this chat', 403);
      }

      const insights = await this.geminiService.generateInsights(chat.messages);

      res.status(200).json({
        status: 'success',
        data: { insights },
      });
    } catch (error) {
      next(error);
    }
  };
} 