import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService?: NotificationService) {
    this.notificationService =
      notificationService ?? new NotificationService();
  }

  send = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, message } = req.body;
      await this.notificationService.sendNotification(Number(userId), message);
      res.status(202).json({ success: true });
    } catch (err) {
      next(err);
    }
  };
}
