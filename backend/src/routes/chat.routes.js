import express from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { messageSchema } from '../validations/chat.validation.js';
import expressValidator from 'express-validator';
const { checkSchema } = expressValidator;

const router = express.Router();
const chatController = new ChatController();

// Protect all routes
router.use(protect);

// Get chat history for the authenticated user (must be before /:chatId route)
router.get('/history', chatController.getChatHistory);

// Create a new chat
router.post('/create', chatController.createChat);

// Get all chats
router.get('/', chatController.getChats);

// Send a message (new endpoint to match frontend)
router.post('/message', checkSchema(messageSchema), validate, async (req, res, next) => {
  try {
    const { chatId, content } = req.body;
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    req.params = { chatId };
    req.body = { content };
    await chatController.sendMessage(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Get a specific chat
router.get('/:chatId', chatController.getChat);

// Send a message in a chat (keeping for backward compatibility)
router.post('/:chatId/messages', checkSchema(messageSchema), validate, chatController.sendMessage);

// Update a chat
router.patch('/:chatId', chatController.updateChat);

// Delete a chat
router.delete('/:chatId', chatController.deleteChat);

// Chat analysis endpoints
router.post('/:chatId/summary', chatController.getSummary);
router.post('/:chatId/motivation', chatController.getMotivation);
router.post('/:chatId/improvements', chatController.getImprovements);

export default router; 