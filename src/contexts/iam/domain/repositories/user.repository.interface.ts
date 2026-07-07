import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

export interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export interface SessionMetadata {
  userId: string;
  role: Role;
  email: string;
  expiresAt: Date;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
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
  ): Promise<SessionMetadata | null>;
  listSessions(userId: string): Promise<Session[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
