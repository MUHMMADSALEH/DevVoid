import expressValidator from 'express-validator';
const { checkSchema } = expressValidator;

export const registerSchema = {
  email: {
    isEmail: {
      errorMessage: 'Please enter a valid email address',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
  name: {
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
};

export const loginSchema = {
  email: {
    isEmail: {
      errorMessage: 'Please enter a valid email address',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
}; 