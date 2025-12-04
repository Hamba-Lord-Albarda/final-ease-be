export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  role: 'MAHASISWA' | 'DOSEN' | 'ADMIN' | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
