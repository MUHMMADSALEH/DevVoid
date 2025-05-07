import { body } from 'express-validator';

export const messageSchema = [
  body('chatId')
    .notEmpty()
    .withMessage('Chat ID is required')
    .isMongoId()
    .withMessage('Invalid chat ID'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
]; 