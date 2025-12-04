CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'MAHASISWA',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_original_name VARCHAR(255) NOT NULL,
  file_storage_path VARCHAR(255) NOT NULL,
  file_mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  file_size_bytes BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  reject_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
