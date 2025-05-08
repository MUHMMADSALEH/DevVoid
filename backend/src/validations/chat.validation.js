import expressValidator from 'express-validator';
const { checkSchema } = expressValidator;

export const messageSchema = {
  content: {
    notEmpty: {
      errorMessage: 'Message content is required',
    },
    isLength: {
      options: { min: 1, max: 1000 },
      errorMessage: 'Message must be between 1 and 1000 characters',
    },
  },
}; 