import { dbPool } from '../../config/db';

export class NotificationRepository {
  async createLog(userId: number, message: string): Promise<void> {
    await dbPool.query(
      `INSERT INTO notification_logs (user_id, message)
       VALUES ($1, $2)`,
      [userId, message]
    );
  }
}
