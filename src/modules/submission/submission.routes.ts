import { Router } from 'express';
import { SubmissionController } from './submission.controller';
import { authGuard } from '../../core/middleware/authGuard';
import { uploadToCloudinary } from '../../config/cloudinary';

// Base path /api/submissions
const router = Router();
const controller = new SubmissionController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', authGuard, uploadToCloudinary.single('file'), controller.create);

router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export const submissionRoutes = router;
