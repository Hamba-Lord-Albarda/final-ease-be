import { NotificationRepository } from './notification.repository';
import { logger } from '../../config/logger';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository?: NotificationRepository) {
    this.notificationRepository =
      notificationRepository ?? new NotificationRepository();
  }

  async sendNotification(userId: number, message: string): Promise<void> {
    // pake log info aja biar ga ribet
    logger.info(`Sending notification to user ${userId}: ${message}`);
    await this.notificationRepository.createLog(userId, message);
  }
}
