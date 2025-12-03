export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Submission {
  id: number;
  userId: number;
  title: string;
  description?: string;

  fileOriginalName: string;
  fileStoragePath: string;
  fileMimeType: string;
  fileSizeBytes: number;

  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubmissionInput {
  userId: number;
  title: string;
  description?: string;
  file: {
    originalName: string;
    storagePath: string;
    mimeType: string;
    size: number;
  };
}

export interface UpdateSubmissionInput {
  title?: string;
  description?: string;
}
