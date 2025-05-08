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

// Chat routes
router.post('/', chatController.createChat);
router.get('/', chatController.getChats);
router.get('/:chatId', chatController.getChat);
router.post('/:chatId/messages', checkSchema(messageSchema), validate, chatController.sendMessage);
router.patch('/:chatId', chatController.updateChat);
router.delete('/:chatId', chatController.deleteChat);
router.get('/:chatId/summary', chatController.getSummary);
router.get('/:chatId/insights', chatController.getInsights);

export default router; 