import { Request, Response, NextFunction } from 'express';
import { SubmissionService } from './submission.service';
import { NotificationService } from '../notification/notification.service';
import { AppError } from '../../core/errors/AppError';

export class SubmissionController {
  private submissionService: SubmissionService;
  private notificationService: NotificationService;

  constructor(
    submissionService?: SubmissionService,
    notificationService?: NotificationService
  ) {
    this.submissionService = submissionService ?? new SubmissionService();
    this.notificationService = notificationService ?? new NotificationService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissions = await this.submissionService.getAllSubmissions();
      res.json({ success: true, data: submissions });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const submission = await this.submissionService.getSubmissionById(id);
      res.json({ success: true, data: submission });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        throw new AppError('PDF file is required', 400);
      }

      const auth = (req as any).auth;
      if (!auth) {
        throw new AppError('Unauthorized', 401);
      }

      const userId = auth.sub as number;
      const userName = auth.name || 'Mahasiswa';
      const title = req.body.title;
      const description = req.body.description;

      const submission = await this.submissionService.createSubmission({
        userId,
        title,
        description,
        file: {
          originalName: file.originalname,
          storagePath: file.path,
          mimeType: file.mimetype,
          size: file.size
        }
      });

      await this.notificationService.notifyNewSubmissionToDosen(userName, title);

      res.status(201).json({ success: true, data: submission });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { title, description } = req.body;
      const submission = await this.submissionService.updateSubmission(id, {
        title,
        description
      });
      res.json({ success: true, data: submission });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.submissionService.deleteSubmission(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
