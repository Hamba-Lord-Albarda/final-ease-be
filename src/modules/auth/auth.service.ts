import { AppError } from '../../core/errors/AppError';
import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput, User } from './auth.entity';
import { signJwt } from '../../core/utils/jwt';

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

    const passwordHash = `hash(${payload.password})`;
    const role = payload.role ?? 'MAHASISWA';

    const user = await this.authRepository.createUser(
      payload.name,
      payload.email,
      passwordHash,
      role
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

    const expectedHash = `hash(${payload.password})`;
    if (user.passwordHash !== expectedHash) {
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
