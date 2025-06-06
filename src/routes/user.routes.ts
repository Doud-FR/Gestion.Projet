import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import * as userController from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), userController.getAllUsers);
router.get('/:id', userController.getUserById);

router.put('/:id',
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('email').optional().isEmail(),
  validateRequest,
  userController.updateUser
);

router.patch('/:id/role',
  authorize('ADMIN'),
  body('role').isIn(['ADMIN', 'PROJECT_MANAGER', 'TECHNICIAN', 'USER']),
  validateRequest,
  userController.updateUserRole
);

router.delete('/:id', authorize('ADMIN'), userController.deleteUser);

router.post('/',
  authorize('ADMIN'),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('role').isIn(['ADMIN', 'PROJECT_MANAGER', 'TECHNICIAN', 'USER']),
  validateRequest,
  userController.createUser
);

export default router;
