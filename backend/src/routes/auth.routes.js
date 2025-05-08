import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import expressValidator from 'express-validator';
const { checkSchema } = expressValidator;

const router = express.Router();
const authController = new AuthController();

router.post('/register', checkSchema(registerSchema), validate, authController.register);
router.post('/login', checkSchema(loginSchema), validate, authController.login);
router.get('/verify', authController.verifyToken);

export default router; 