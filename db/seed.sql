INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Mahasiswa Demo', 'mahasiswa@lasti.com', 'hash(password123)', 'MAHASISWA'),
  ('Dosen Demo', 'dosen@lasti.com', 'hash(password123)', 'DOSEN')
ON CONFLICT (email) DO NOTHING;
