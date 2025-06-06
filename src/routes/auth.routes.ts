import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, refreshToken, logout } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest,
  login
);

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  validateRequest,
  register
);

router.post('/refresh',
  body('refreshToken').notEmpty(),
  validateRequest,
  refreshToken
);

router.post('/logout',
  body('refreshToken').notEmpty(),
  validateRequest,
  logout
);

export default router;
