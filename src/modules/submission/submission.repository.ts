import { dbPool } from '../../config/db';
import {
  Submission,
  CreateSubmissionInput,
  UpdateSubmissionInput,
  SubmissionStatus
} from './submission.entity';

export class SubmissionRepository {
  async findAll(): Promise<Submission[]> {
    const result = await dbPool.query<Submission>(
      `SELECT
         id,
         user_id AS "userId",
         title,
         description,
         file_original_name AS "fileOriginalName",
         file_storage_path AS "fileStoragePath",
         file_mime_type AS "fileMimeType",
         file_size_bytes AS "fileSizeBytes",
         status,
         reject_reason AS "rejectReason",
         created_at AS "createdAt",
         updated_at AS "updatedAt"
       FROM submissions
       ORDER BY id`
    );
    return result.rows;
  }

  async findById(id: number): Promise<Submission | null> {
    const result = await dbPool.query<Submission>(
      `SELECT
         id,
         user_id AS "userId",
         title,
         description,
         file_original_name AS "fileOriginalName",
         file_storage_path AS "fileStoragePath",
         file_mime_type AS "fileMimeType",
         file_size_bytes AS "fileSizeBytes",
         status,
         reject_reason AS "rejectReason",
         created_at AS "createdAt",
         updated_at AS "updatedAt"
       FROM submissions
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateSubmissionInput): Promise<Submission> {
    const result = await dbPool.query<Submission>(
      `INSERT INTO submissions (
         user_id,
         title,
         description,
         file_original_name,
         file_storage_path,
         file_mime_type,
         file_size_bytes,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
       RETURNING
         id,
         user_id AS "userId",
         title,
         description,
         file_original_name AS "fileOriginalName",
         file_storage_path AS "fileStoragePath",
         file_mime_type AS "fileMimeType",
         file_size_bytes AS "fileSizeBytes",
         status,
         reject_reason AS "rejectReason",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [
        data.userId,
        data.title,
        data.description ?? null,
        data.file.originalName,
        data.file.storagePath,
        data.file.mimeType,
        data.file.size
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateSubmissionInput): Promise<Submission | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.title !== undefined) {
      values.push(data.title);
      fields.push(`title = $${values.length}`);
    }

    if (data.description !== undefined) {
      values.push(data.description);
      fields.push(`description = $${values.length}`);
    }

    if (fields.length === 0) {
      const existing = await this.findById(id);
      return existing;
    }

    values.push(id);
    const setClause = fields.join(', ');
    const query = `
      UPDATE submissions
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING
        id,
        user_id AS "userId",
        title,
        description,
        file_original_name AS "fileOriginalName",
        file_storage_path AS "fileStoragePath",
        file_mime_type AS "fileMimeType",
        file_size_bytes AS "fileSizeBytes",
        status,
        reject_reason AS "rejectReason",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await dbPool.query<Submission>(query, values);
    return result.rows[0] || null;
  }

  async updateStatus(id: number, status: SubmissionStatus): Promise<Submission | null> {
    const result = await dbPool.query<Submission>(
      `UPDATE submissions
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING
         id,
         user_id AS "userId",
         title,
         description,
         file_original_name AS "fileOriginalName",
         file_storage_path AS "fileStoragePath",
         file_mime_type AS "fileMimeType",
         file_size_bytes AS "fileSizeBytes",
         status,
         reject_reason AS "rejectReason",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [status, id]
    );
    return result.rows[0] || null;
  }

  async updateStatusWithReason(id: number, status: SubmissionStatus, rejectReason: string): Promise<Submission | null> {
    const result = await dbPool.query<Submission>(
      `UPDATE submissions
       SET status = $1, reject_reason = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING
         id,
         user_id AS "userId",
         title,
         description,
         file_original_name AS "fileOriginalName",
         file_storage_path AS "fileStoragePath",
         file_mime_type AS "fileMimeType",
         file_size_bytes AS "fileSizeBytes",
         status,
         reject_reason AS "rejectReason",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [status, rejectReason, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await dbPool.query('DELETE FROM submissions WHERE id = $1', [id]);
  }
}
