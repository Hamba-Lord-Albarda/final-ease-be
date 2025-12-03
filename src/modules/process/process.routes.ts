import { Router } from 'express';
import { ProcessController } from './process.controller';
import { authGuard } from '../../core/middleware/authGuard';
import { roleGuard } from '../../core/middleware/roleGuard';

const router = Router();
const controller = new ProcessController();

router.post(
  '/submissions/:id/approve',
  authGuard,
  roleGuard(['DOSEN']),
  controller.approveSubmission
);

router.post(
  '/submissions/:id/reject',
  authGuard,
  roleGuard(['DOSEN']),
  controller.rejectSubmission
);

export const processRoutes = router;
