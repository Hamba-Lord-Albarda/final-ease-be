-- Password: password123 (bcrypt hash)
INSERT INTO users (name, email, password_hash, role, phone_number)
VALUES
  ('Mahasiswa Demo', 'mahasiswa@lasti.com', '$2b$10$dC/qTC9p8XOSUqP0wxT2R.kDn5CjQJKjonDQWtiPGUtwPQBxKSTVS', 'MAHASISWA', '6281234567890'),
  ('Dosen Demo', 'dosen@lasti.com', '$2b$10$dC/qTC9p8XOSUqP0wxT2R.kDn5CjQJKjonDQWtiPGUtwPQBxKSTVS', 'DOSEN', '6281234567891')
ON CONFLICT (email) DO NOTHING;
