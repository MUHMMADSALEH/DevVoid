import expressValidator from 'express-validator';
const validator = expressValidator as any;
const { checkSchema } = validator;

export const registerSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address'
    }
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  },
  name: {
    notEmpty: {
      errorMessage: 'Name is required'
    },
    isLength: {
      options: { min: 2 },
      errorMessage: 'Name must be at least 2 characters long'
    }
  }
});

export const loginSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address'
    }
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required'
    }
  }
}); 