import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IUserRepository,
  Session,
  SessionMetadata,
} from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    super(userRepository);
  }

  private mapToDomain(ormEntity: UserEntity): User {
    return User.restore(
      ormEntity.id,
      ormEntity.email,
      ormEntity.authProvider,
      ormEntity.providerId,
      ormEntity.role,
      ormEntity.planId,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.fullName,
      ormEntity.avatarUrl,
      ormEntity.phone,
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

  async save(user: User): Promise<User> {
    const ormEntity = new UserEntity();
    ormEntity.id = user.id;
    ormEntity.email = user.email;
    ormEntity.authProvider = user.authProvider;
    ormEntity.providerId = user.providerId;
    ormEntity.role = user.role;
    ormEntity.planId = user.planId;
    ormEntity.createdAt = user.createdAt;
    ormEntity.updatedAt = user.updatedAt;
    ormEntity.fullName = user.fullName;
    ormEntity.avatarUrl = user.avatarUrl;
    ormEntity.phone = user.phone;

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

  async listSessions(userId: string): Promise<Session[]> {
    const sessions = await this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<SessionMetadata | null> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
      relations: { user: true },
    });
    if (!session || !session.user) return null;
    return {
      userId: session.userId,
      role: session.user.role,
      email: session.user.email,
      expiresAt: session.expiresAt,
    };
  }
}
