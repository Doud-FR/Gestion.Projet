import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import * as clientController from '../controllers/client.controller';

const router = Router();

router.use(authenticate);

router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);

router.post('/',
  authorize('ADMIN', 'PROJECT_MANAGER'),
  body('name').notEmpty().trim(),
  body('email').isEmail(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('website').optional().isURL(),
  validateRequest,
  clientController.createClient
);

router.put('/:id',
  authorize('ADMIN', 'PROJECT_MANAGER'),
  body('name').optional().trim(),
  body('email').optional().isEmail(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('website').optional().isURL(),
  validateRequest,
  clientController.updateClient
);

router.delete('/:id',
  authorize('ADMIN'),
  clientController.deleteClient
);

export default router;
