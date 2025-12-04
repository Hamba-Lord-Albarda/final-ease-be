import { NotificationRepository } from './notification.repository';
import { FonnteService } from './fonnte.service';
import { logger } from '../../config/logger';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private fonnteService: FonnteService;

  constructor(
    notificationRepository?: NotificationRepository,
    fonnteService?: FonnteService
  ) {
    this.notificationRepository = notificationRepository ?? new NotificationRepository();
    this.fonnteService = fonnteService ?? new FonnteService();
  }

  async sendNotification(userId: number, message: string): Promise<void> {
    logger.info(`Sending notification to user ${userId}: ${message}`);
    await this.notificationRepository.createLog(userId, message);
  }

  async notifyApproval(userId: number, submissionTitle: string): Promise<void> {
    const message = `Your submission "${submissionTitle}" has been approved`;
    
    await this.notificationRepository.createLog(userId, message);
    
    const user = await this.notificationRepository.getUserById(userId);
    if (user?.phoneNumber) {
      await this.fonnteService.notifyApproved(user.name, user.phoneNumber, submissionTitle);
    }
    
    logger.info(`Approval notification sent to user ${userId}`);
  }

  async notifyRejection(userId: number, submissionTitle: string, reason: string): Promise<void> {
    const message = `Your submission "${submissionTitle}" was rejected. Reason: ${reason}`;
    
    await this.notificationRepository.createLog(userId, message);
    
    const user = await this.notificationRepository.getUserById(userId);
    if (user?.phoneNumber) {
      await this.fonnteService.notifyRejected(user.name, user.phoneNumber, submissionTitle, reason);
    }
    
    logger.info(`Rejection notification sent to user ${userId}`);
  }

  async notifyNewSubmissionToDosen(studentName: string, submissionTitle: string): Promise<void> {
    const dosenUsers = await this.notificationRepository.getDosenUsers();
    
    for (const dosen of dosenUsers) {
      const message = `New submission from ${studentName}: "${submissionTitle}"`;
      await this.notificationRepository.createLog(dosen.id, message);
      
      if (dosen.phoneNumber) {
        await this.fonnteService.notifyNewSubmission(dosen.name, dosen.phoneNumber, studentName, submissionTitle);
      }
    }
    
    logger.info(`New submission notification sent to ${dosenUsers.length} dosen(s)`);
  }
}
