import { Pool } from 'pg';
import { env } from './env';

// Support both DATABASE_URL (Render) and individual config (Docker/local)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database
    };

export const dbPool = new Pool(poolConfig);

dbPool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});
