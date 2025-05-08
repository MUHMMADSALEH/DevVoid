import expressValidator from 'express-validator';
const { checkSchema } = expressValidator;

export const registerSchema = {
  user: {
    isObject: {
      errorMessage: 'User object is required',
    },
  },
  'user.email': {
    isEmail: {
      errorMessage: 'Please enter a valid email address',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  'user.password': {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
  'user.name': {
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
};

export const loginSchema = {
  user: {
    isObject: {
      errorMessage: 'User object is required',
    },
  },
  'user.email': {
    isEmail: {
      errorMessage: 'Please enter a valid email address',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  'user.password': {
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
}; 