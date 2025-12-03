import { Pool } from 'pg';
import { env } from './env';

export const dbPool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database
});

dbPool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});
