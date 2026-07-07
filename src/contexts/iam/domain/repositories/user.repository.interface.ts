import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  createSession(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<void>;
  revokeSession(refreshToken: string): Promise<void>;
  findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: string; role: Role; expiresAt: Date } | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
