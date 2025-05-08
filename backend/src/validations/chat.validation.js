import { body } from 'express-validator';

export const messageSchema = {
  chatId: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Chat ID is required',
  },
  content: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Message content is required',
  },
  type: {
    in: ['body'],
    isString: true,
    optional: true,
    isIn: {
      options: [['user', 'ai']],
      errorMessage: 'Message type must be either "user" or "ai"',
    },
  },
}; 