import { dbPool } from '../../config/db';

interface UserWithPhone {
  id: number;
  name: string;
  phoneNumber: string | null;
}

export class NotificationRepository {
  async createLog(userId: number, message: string): Promise<void> {
    await dbPool.query(
      `INSERT INTO notification_logs (user_id, message)
       VALUES ($1, $2)`,
      [userId, message]
    );
  }

  async getUserById(userId: number): Promise<UserWithPhone | null> {
    const result = await dbPool.query<UserWithPhone>(
      `SELECT id, name, phone_number AS "phoneNumber" FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async getDosenUsers(): Promise<UserWithPhone[]> {
    const result = await dbPool.query<UserWithPhone>(
      `SELECT id, name, phone_number AS "phoneNumber" FROM users WHERE role = 'DOSEN'`
    );
    return result.rows;
  }
}
