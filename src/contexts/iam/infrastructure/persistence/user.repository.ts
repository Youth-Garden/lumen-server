import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserOrmEntity } from './entities/user.orm-entity';
import { SessionOrmEntity } from './entities/session.orm-entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    @InjectRepository(SessionOrmEntity)
    private readonly sessionRepository: Repository<SessionOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: UserOrmEntity): UserEntity {
    return new UserEntity(
      ormEntity.id,
      ormEntity.email,
      ormEntity.passwordHash,
      ormEntity.role, // ép tạm enum
      ormEntity.planId,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async save(
    user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserEntity> {
    const ormEntity = this.userRepository.create({
      email: user.email,
      passwordHash: user.passwordHash,
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
}
