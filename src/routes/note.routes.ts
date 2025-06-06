import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import * as noteController from '../controllers/note.controller';

const router = Router();

router.use(authenticate);

router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);

router.post('/',
  body('title').notEmpty().trim(),
  body('content').notEmpty(),
  body('projectId').optional().isUUID(),
  body('tags').optional().isArray(),
  validateRequest,
  noteController.createNote
);

router.put('/:id',
  noteController.updateNote
);

router.delete('/:id',
  noteController.deleteNote
);

export default router;
