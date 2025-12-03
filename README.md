# finaleasebe

Backend untuk Platform FinalEase

Use case utama  
Sistem pengelolaan **submission tugas/berkas PDF** oleh **mahasiswa** yang kemudian **di-review dosen**.  
Alur utama  
Mahasiswa upload draft TA atau KP (PDF). Dosen approve atau reject.

---

## Author
- 18220026 Annel Rashka Perdana
- 18223018 Naila Selvira Budiana
- 18223054 Allodya Qonnita Arofa
- 18223066 Nazwan Siddqi Muttaqin
- 18223092 Gabriela Jennifer Sandy
- 18223096 Matthew Sebastian Kurniawan


## 1. Tech stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express
- Database: PostgreSQL
- Auth: JWT
- Upload file: Multer
- Package manager: npm

---

## 2. Konsep arsitektur

Monolith rasa microservice wkwk

### Modul utama

- `auth-service`  
  - Register dan login  
  - Mengeluarkan JWT  
  - Mengelola user dan role

- `submission-service`  
  - CRUD submission  
  - Upload file PDF  
  - Simpan metadata file ke database

- `process-service`  
  - Alur bisnis approve dan reject submission  
  - Cuma role DOSEN yang boleh approve atau reject  
  - Manggil submission-service dan notification-service

- `notification-service`  
  - Menangani pengiriman notifikasi (di prototype ini cuma log info terminal doang)

### Pola MVC per modul

- `*.routes.ts`  
  Definisi route Express
- `*.controller.ts`  
  Terima HTTP request dan memanggil service
- `*.service.ts`  
  Business logic
- `*.repository.ts`  
  Query database
- `*.entity.ts`  
  Tipe data domain

---

## 3. Struktur folder

Struktur inti

```text
finaleasebe/
  db/
    schema.sql
    seed.sql

  src/
    app.ts
    server.ts

    config/
      env.ts
      db.ts
      logger.ts

    core/
      errors/
        AppError.ts
      middleware/
        errorHandler.ts
        requestLogger.ts
        authGuard.ts
        roleGuard.ts
      utils/
        jwt.ts
        index.ts

    shared/
      types/
        index.ts

    modules/
      auth/
        auth.entity.ts
        auth.repository.ts
        auth.service.ts
        auth.controller.ts
        auth.routes.ts

      submission/
        submission.entity.ts
        submission.repository.ts
        submission.service.ts
        submission.controller.ts
        submission.routes.ts

      process/
        process.service.ts
        process.controller.ts
        process.routes.ts

      notification/
        notification.repository.ts
        notification.service.ts
        notification.controller.ts
        notification.routes.ts

  uploads/
    submissions/
      ... file PDF yang diupload
```

Catatan

- Folder `uploads/` dibuat otomatis jika belum ada.
- Express expose `uploads/` melalui path `/uploads`.

---

## 4. Database

### 4.1. Schema

File `db/schema.sql`

Tabel `users`

- `id`  
- `name`  
- `email` (unique)  
- `password_hash`  
- `role`  
  - Contoh `MAHASISWA`, `DOSEN`  
- `created_at`  
- `updated_at`

Tabel `submissions`

- `id`  
- `user_id` (FK ke `users.id`)  
- `title`  
- `description`  
- Metadata file PDF
  - `file_original_name`  
  - `file_storage_path`  
  - `file_mime_type`  
  - `file_size_bytes`  
- `status`  
  - `PENDING`, `APPROVED`, `REJECTED`  
- `created_at`  
- `updated_at`

Tabel `notification_logs`

- `id`  
- `user_id`  
- `message`  
- `created_at`

### 4.2. Seed data

File `db/seed.sql`

Menyisipkan dua user

- Mahasiswa
  - email `mahasiswa@lasti.com`
  - password `password123`
  - role `MAHASISWA`

- Dosen
  - email `dosen@lasti.com`
  - password `password123`
  - role `DOSEN`

Password disimpan dalam bentuk string mock `hash(password123)`.  
Auth service juga membandingkan dengan pola ini.

---

## 5. Setup dan menjalankan

### 5.1. Instalasi

```bash
npm install
```

### 5.2. Environment

Buat file `.env` di root project (contoh)

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres (sesuaiin di db lokal masing2)
DB_PASSWORD=postgres (sesuaiin di db lokal masing2)
DB_NAME=finalease_db

JWT_SECRET=AkuCintaKamuTapiKamuCintaDia:(
JWT_EXPIRES_IN=1h

NODE_ENV=development
```

### 5.3. Setup database

Buat database, login dulu ke postgre nya

```bash
CREATE DATABASE finalease_db
```

Jalankan schema dan seed

```bash
psql -h localhost -U postgres -d finalease_db -f db/schema.sql
psql -h localhost -U postgres -d finalease_db -f db/seed.sql
```

### 5.4. Jalankan aplikasi

Mode development

```bash
npm run dev
```

Test cepat

```bash
curl http://localhost:3000/health
```

Respons

```json
{ "status": "ok" }
```

---

## 6. Security (JWT dan Role)

### 6.1. JWT

JWT dibuat di `AuthService` menggunakan util `signJwt`.

Payload berisi

- `sub` id user  
- `email`  
- `role`

Disimpan di header

```http
Authorization: Bearer <jwt-token>
```

### 6.2. Middleware `authGuard`

File `src/core/middleware/authGuard.ts`

Fungsi

- Membaca header `Authorization`
- Verifikasi token
- Menaruh payload JWT di `req.auth`

Jika gagal

- Lempar `AppError('Unauthorized', 401)` atau `AppError('Invalid or expired token', 401)`

### 6.3. Middleware `roleGuard`

File `src/core/middleware/roleGuard.ts`

Cara pakai

```ts
router.post(
  '/submissions/:id/approve',
  authGuard,
  roleGuard(['DOSEN']),
  controller.approveSubmission
);
```

Fungsi

- Membaca `req.auth.role`
- Menolak jika role tidak ada di daftar `allowedRoles`
- Melempar `AppError('Forbidden. Insufficient role', 403)`

Contoh

- Approve atau reject hanya boleh `DOSEN`
- Submit submission boleh semua user yang login (cukup pakai `authGuard` saja)

---

## 7. Endpoint utama

### 7.1. Health

- `GET /health`

### 7.2. Auth

- `POST /api/auth/login`  
  Body

  ```json
  {
    "email": "mahasiswa@lasti.com",
    "password": "password123"
  }
  ```

  Respons

  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "token": "<jwt-token>"
    }
  }
  ```

- `POST /api/auth/register`  
  buat nambah user baru kalo

### 7.3. Submission

- `GET /api/submissions`  
  Ambil semua submission

- `GET /api/submissions/:id`  
  Ambil detail satu submission

- `POST /api/submissions`  
  Hanya untuk user yang sudah login  
  Wajib header

  ```http
  Authorization: Bearer <jwt-token-mahasiswa>
  ```

  Body `multipart/form-data`

  - `title` (text)  
  - `description` (text, opsional)  
  - `file` (file PDF)

- `PUT /api/submissions/:id`  
  Update title dan description

- `DELETE /api/submissions/:id`  
  Hapus submission

File PDF disimpan di disk.  
Folder upload default

```text
uploads/submissions
```

Akses file via URL

```text
http://localhost:3000/uploads/submissions/<nama-file>.pdf
```

### 7.4. Process (workflow)

- `POST /api/process/submissions/:id/approve`  
  Hanya DOSEN yang boleh  
  Header

  ```http
  Authorization: Bearer <jwt-token-dosen>
  ```

  Body boleh kosong

  ```json
  {}
  ```

  Aturan

  - Hanya bisa dari status `PENDING` ke `APPROVED`
  - Jika status bukan `PENDING`, balas error 400  
    pesan `Submission is not in PENDING status`
  - Setelah approve, akan membuat log di `notification_logs`

- `POST /api/process/submissions/:id/reject`  
  Hanya DOSEN yang boleh  
  Header sama  
  Body

  ```json
  {
    "reason": "Alasan penolakan"
  }
  ```

  Aturan sama  
  Mengubah status `PENDING` menjadi `REJECTED` dan log notifikasi.

### 7.5. Notification

- `POST /api/notifications/send`  
  Contoh endpoint sederhana buat ngetes notification-service

  Body

  ```json
  {
    "userId": 1,
    "message": "Contoh notifikasi"
  }
  ```

---

## 8. Error handling

File `src/core/middleware/errorHandler.ts`

Karakteristik

- Menangani semua error di akhir middleware
- Kasus spesifik
  - `AppError`  
    pakai `statusCode` dan message dari error
  - `MulterError`  
    menangani error upload file  
    misalnya limit ukuran file
  - `SyntaxError` yang berisi body  
    menandakan JSON tidak valid
  - Error lain  
    dianggap internal error

Respons ke client

```json
{
  "success": false,
  "message": "..."
}
```


---

## 9. Alur end to end

Urutan

1. Jalankan database dan seed
2. Jalankan aplikasi
3. Login sebagai mahasiswa
4. Login sebagai dosen
5. Mahasiswa upload submission baru (PDF)
6. Dosen approve atau reject submission

Ringkasan langkah

1. `POST /api/auth/login`  
   login mahasiswa  
   simpan token mahasiswa

2. `POST /api/auth/login`  
   login dosen  
   simpan token dosen

3. `POST /api/submissions`  
   header `Authorization: Bearer <token-mahasiswa>`  
   body form-data dengan field `title`, `description`, `file`

4. `POST /api/process/submissions/:id/approve`  
   header `Authorization: Bearer <token-dosen>`

   atau

   `POST /api/process/submissions/:id/reject`  
   header sama dan body JSON `{"reason": "..."}`

5. `GET /api/submissions/:id`  
   pastikan status berubah sesuai.

---
