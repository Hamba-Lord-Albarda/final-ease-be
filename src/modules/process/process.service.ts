import { SubmissionService } from '../submission/submission.service';
import { NotificationService } from '../notification/notification.service';
import { Submission } from '../submission/submission.entity';
import { AppError } from '../../core/errors/AppError';

export class ProcessService {
  private submissionService: SubmissionService;
  private notificationService: NotificationService;

  constructor(
    submissionService?: SubmissionService,
    notificationService?: NotificationService
  ) {
    this.submissionService = submissionService ?? new SubmissionService();
    this.notificationService = notificationService ?? new NotificationService();
  }

  async approveSubmission(submissionId: number, approverId: number): Promise<Submission> {
    const submission = await this.submissionService.getSubmissionById(submissionId);

    if (submission.status !== 'PENDING') {
      throw new AppError('Submission is not in PENDING status', 400);
    }

    const updated = await this.submissionService.updateSubmissionStatus(
      submissionId,
      'APPROVED'
    );

    await this.notificationService.sendNotification(
      submission.userId,
      `Your submission "${updated.title}" has been approved by user ${approverId}`
    );

    return updated;
  }

  async rejectSubmission(
    submissionId: number,
    approverId: number,
    reason: string
  ): Promise<Submission> {
    const submission = await this.submissionService.getSubmissionById(submissionId);

    if (submission.status !== 'PENDING') {
      throw new AppError('Submission is not in PENDING status', 400);
    }

    const updated = await this.submissionService.updateSubmissionStatusWithReason(
      submissionId,
      'REJECTED',
      reason
    );

    await this.notificationService.sendNotification(
      submission.userId,
      `Your submission "${updated.title}" was rejected by user ${approverId}. Reason: ${reason}`
    );

    return updated;
  }
}
