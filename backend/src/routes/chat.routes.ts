import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { messageSchema } from '../validations/chat.validation.js';

const router = Router();
const chatController = new ChatController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new chat
router.post('/create', chatController.createChat);

// Send a message
router.post(
  '/message',
  validateRequest(messageSchema),
  chatController.sendMessage
);

// Get chat history
router.get('/history', chatController.getChatHistory);

// Generate summary for a chat
router.post('/:chatId/summary', chatController.generateSummary);

// Get insights for a chat
router.get('/:chatId/insights', chatController.generateInsights);

export default router; 