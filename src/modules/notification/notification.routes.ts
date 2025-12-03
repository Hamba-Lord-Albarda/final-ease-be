import { Router } from 'express';
import { NotificationController } from './notification.controller';

// Base path /api/notifications
const router = Router();
const controller = new NotificationController();

router.post('/send', controller.send);

export const notificationRoutes = router;
