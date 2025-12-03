import { AppError } from '../../core/errors/AppError';
import {
  Submission,
  CreateSubmissionInput,
  UpdateSubmissionInput,
  SubmissionStatus
} from './submission.entity';
import { SubmissionRepository } from './submission.repository';

export class SubmissionService {
  private submissionRepository: SubmissionRepository;

  constructor(submissionRepository?: SubmissionRepository) {
    this.submissionRepository = submissionRepository ?? new SubmissionRepository();
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return this.submissionRepository.findAll();
  }

  async getSubmissionById(id: number): Promise<Submission> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }
    return submission;
  }

  async createSubmission(payload: CreateSubmissionInput): Promise<Submission> {
    return this.submissionRepository.create(payload);
  }

  async updateSubmission(id: number, payload: UpdateSubmissionInput): Promise<Submission> {
    const updated = await this.submissionRepository.update(id, payload);
    if (!updated) {
      throw new AppError('Submission not found', 404);
    }
    return updated;
  }

  async updateSubmissionStatus(id: number, status: SubmissionStatus): Promise<Submission> {
    const updated = await this.submissionRepository.updateStatus(id, status);
    if (!updated) {
      throw new AppError('Submission not found', 404);
    }
    return updated;
  }

  async deleteSubmission(id: number): Promise<void> {
    const existing = await this.submissionRepository.findById(id);
    if (!existing) {
      throw new AppError('Submission not found', 404);
    }
    await this.submissionRepository.delete(id);
  }
}
