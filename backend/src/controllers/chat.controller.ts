import { Request, Response, NextFunction } from 'express';
import { ChatRepository } from '../repositories/chat.repository.js';
import { GeminiService } from '../services/gemini.service.js';
import { AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

export class ChatController {
  private chatRepository: ChatRepository;
  private geminiService: GeminiService;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.geminiService = new GeminiService();
    console.log('ChatController initialized');
  }

  createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
      }

      const chat = await this.chatRepository.create(req.user.id);
      console.log('Created new chat:', chat._id);
      res.status(201).json({
        status: 'success',
        data: { chat },
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      next(error);
    }
  };

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId, content } = req.body;
      console.log('Received message request:', { chatId, content });

      if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
      }

      if (!chatId || !content) {
        throw new AppError('Missing required fields: chatId and content', 400);
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError('Invalid chat ID format', 400);
      }

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.userId.toString() !== req.user.id) {
        throw new AppError('Unauthorized access to chat', 403);
      }

      // Add user message
      const userMessage = {
        content,
        sender: 'user' as const,
        timestamp: new Date(),
      };
      console.log('Adding user message:', userMessage);
      await this.chatRepository.addMessage(chatId, userMessage);

      try {
        // Analyze mood
        console.log('Analyzing mood...');
        const mood = await this.geminiService.analyzeMood(content);
        console.log('Mood analysis result:', mood);

        // Generate AI response
        console.log('Generating AI response...');
        const aiResponse = await this.geminiService.generateResponse(content);
        console.log('AI response generated:', aiResponse);

        if (!aiResponse) {
          throw new Error('Empty AI response received');
        }

        // Add AI message with mood
        const aiMessage = {
          content: aiResponse,
          sender: 'ai' as const,
          timestamp: new Date(),
          mood,
        };
        console.log('Adding AI message:', aiMessage);
        await this.chatRepository.addMessage(chatId, aiMessage);

        // Update chat with mood
        const updatedChat = await this.chatRepository.findById(chatId);
        console.log('Chat updated successfully');

        res.status(200).json({
          status: 'success',
          data: {
            chat: updatedChat,
            mood,
          },
        });
      } catch (error) {
        console.error('Error in AI processing:', error);
        // If AI service fails, still return the user's message
        const updatedChat = await this.chatRepository.findById(chatId);
        res.status(200).json({
          status: 'success',
          data: {
            chat: updatedChat,
            mood: 'neutral',
          },
        });
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      next(error);
    }
  };

  getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
      }

      const chats = await this.chatRepository.findByUserId(req.user.id);
      console.log('Retrieved chat history for user:', req.user.id);
      res.status(200).json({
        status: 'success',
        data: { chats },
      });
    } catch (error) {
      console.error('Error getting chat history:', error);
      next(error);
    }
  };

  generateSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;
      console.log('Generating summary for chat:', chatId);

      if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError('Invalid chat ID format', 400);
      }

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.userId.toString() !== req.user.id) {
        throw new AppError('Unauthorized access to chat', 403);
      }

      const messages = chat.messages
        .filter((msg) => msg.sender === 'user')
        .map((msg) => msg.content);

      console.log('Generating summary for messages:', messages);
      const summary = await this.geminiService.generateSummary(messages);
      console.log('Summary generated:', summary);

      await this.chatRepository.updateSummary(chatId, summary);

      res.status(200).json({
        status: 'success',
        data: { summary },
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      next(error);
    }
  };

  generateInsights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;
      console.log('Generating insights for chat:', chatId);

      if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError('Invalid chat ID format', 400);
      }

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.userId.toString() !== req.user.id) {
        throw new AppError('Unauthorized access to chat', 403);
      }

      const messages = chat.messages
        .filter((msg) => msg.sender === 'user')
        .map((msg) => msg.content);

      console.log('Generating insights for messages:', messages);
      const insights = await this.geminiService.generateInsights(messages);
      console.log('Insights generated:', insights);

      res.status(200).json({
        status: 'success',
        data: { insights },
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      next(error);
    }
  };
} 