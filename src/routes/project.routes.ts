import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import * as projectController from '../controllers/project.controller';

const router = Router();

router.use(authenticate);

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

router.post('/',
  authorize('ADMIN', 'PROJECT_MANAGER'),
  body('name').notEmpty().trim(),
  body('clientId').isUUID(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('description').optional().trim(),
  body('budget').optional().isNumeric(),
  validateRequest,
  projectController.createProject
);

router.put('/:id',
  authorize('ADMIN', 'PROJECT_MANAGER'),
  validateRequest,
  projectController.updateProject
);

router.post('/:id/users',
  authorize('ADMIN', 'PROJECT_MANAGER'),
  body('userId').isUUID(),
  body('role').optional().trim(),
  validateRequest,
  projectController.addUserToProject
);

router.delete('/:id',
  authorize('ADMIN'),
  projectController.deleteProject
);

export default router;
