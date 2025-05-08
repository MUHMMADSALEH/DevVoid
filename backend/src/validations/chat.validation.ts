import expressValidator from 'express-validator';
const validator = expressValidator as any;
const { checkSchema } = validator;

export const messageSchema = checkSchema({
  chatId: {
    notEmpty: {
      errorMessage: 'Chat ID is required'
    },
    isMongoId: {
      errorMessage: 'Invalid chat ID'
    }
  },
  content: {
    notEmpty: {
      errorMessage: 'Message content is required'
    },
    isLength: {
      options: { min: 1, max: 1000 },
      errorMessage: 'Message must be between 1 and 1000 characters'
    }
  }
}); 