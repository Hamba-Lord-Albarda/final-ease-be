import { Request, Response, NextFunction } from 'express';
import { ProcessService } from './process.service';
import { AppError } from '../../core/errors/AppError';

export class ProcessController {
  private processService: ProcessService;

  constructor(processService?: ProcessService) {
    this.processService = processService ?? new ProcessService();
  }

  approveSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissionId = Number(req.params.id);
      const auth = (req as any).auth;
      if (!auth) {
        throw new AppError('Unauthorized', 401);
      }
      const approverId = auth.sub as number;
      const updated = await this.processService.approveSubmission(submissionId, approverId);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  rejectSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissionId = Number(req.params.id);
      const auth = (req as any).auth;
      if (!auth) {
        throw new AppError('Unauthorized', 401);
      }
      const approverId = auth.sub as number;
      const { reason } = req.body;
      const updated = await this.processService.rejectSubmission(
        submissionId,
        approverId,
        reason
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };
}
