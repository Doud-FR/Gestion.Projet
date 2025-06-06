import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import * as taskController from '../controllers/task.controller';

const router = Router();

router.use(authenticate);

router.get('/project/:projectId', taskController.getTasksByProject);

router.post('/',
  body('title').notEmpty().trim(),
  body('projectId').isUUID(),
  body('description').optional().trim(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('assignedToId').optional().isUUID(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  validateRequest,
  taskController.createTask
);

router.put('/:id',
  taskController.updateTask
);

router.patch('/:id/status',
  body('status').isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  validateRequest,
  taskController.updateTaskStatus
);

router.delete('/:id',
  taskController.deleteTask
);

export default router;
