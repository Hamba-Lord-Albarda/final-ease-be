import bcrypt from 'bcrypt';
import { AppError } from '../../core/errors/AppError';
import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput, User } from './auth.entity';
import { signJwt } from '../../core/utils/jwt';

const SALT_ROUNDS = 10;

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository?: AuthRepository) {
    this.authRepository = authRepository ?? new AuthRepository();
  }

  async register(payload: RegisterInput): Promise<{ user: User; token: string }> {
    const existing = await this.authRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError('Email is already registered', 400);
    }

    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const role = payload.role ?? 'MAHASISWA';

    const user = await this.authRepository.createUser(
      payload.name,
      payload.email,
      passwordHash,
      role,
      payload.phoneNumber
    );

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }

  async login(payload: LoginInput): Promise<{ user: User; token: string }> {
    const user = await this.authRepository.findByEmail(payload.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }
}
