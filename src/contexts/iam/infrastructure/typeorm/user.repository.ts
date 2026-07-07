import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from './entities/user.entity';
import { SessionEntity } from './entities/session.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  private mapToDomain(ormEntity: User): User {
    return new User(
      ormEntity.id,
      ormEntity.email,
      ormEntity.password,
      ormEntity.authProvider,
      ormEntity.providerId,
      ormEntity.role, // ép tạm enum
      ormEntity.planId,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }
  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }
  async save(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const ormEntity = this.userRepository.create({
      email: user.email,
      password: user.password,
      authProvider: user.authProvider,
      providerId: user.providerId,
      role: user.role,
      planId: user.planId,
    });
    const saved = await this.userRepository.save(ormEntity);
    return this.mapToDomain(saved);
  }

  async createSession(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<void> {
    const session = this.sessionRepository.create({
      userId,
      refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });
    await this.sessionRepository.insert(session);
  }

  async revokeSession(refreshToken: string): Promise<void> {
    await this.sessionRepository.delete({ refreshToken });
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: string; role: string; expiresAt: Date } | null> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
      relations: { user: true },
    });
    if (!session || !session.user) return null;
    return {
      userId: session.userId,
      role: session.user.role,
      expiresAt: session.expiresAt,
    };
  }
}
