import { dbPool } from '../../config/db';
import { User } from './auth.entity';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await dbPool.query<User>(
      `SELECT
         id,
         name,
         email,
         password_hash AS "passwordHash",
         phone_number AS "phoneNumber",
         role,
         created_at AS "createdAt",
         updated_at AS "updatedAt"
       FROM users
       WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  async createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: string,
    phoneNumber?: string
  ): Promise<User> {
    const result = await dbPool.query<User>(
      `INSERT INTO users (name, email, password_hash, role, phone_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING
         id,
         name,
         email,
         password_hash AS "passwordHash",
         phone_number AS "phoneNumber",
         role,
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [name, email, passwordHash, role, phoneNumber || null]
    );
    return result.rows[0];
  }
}
