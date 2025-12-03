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
    role: string
  ): Promise<User> {
    const result = await dbPool.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         name,
         email,
         password_hash AS "passwordHash",
         role,
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [name, email, passwordHash, role]
    );
    return result.rows[0];
  }
}
