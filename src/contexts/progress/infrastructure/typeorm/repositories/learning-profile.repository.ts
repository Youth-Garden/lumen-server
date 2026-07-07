import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILearningProfileRepository } from '../../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../../domain/aggregates/learning-profile.aggregate';
import { LearningProfileEntity } from '../entities/learning-profile.entity';

@Injectable()
export class LearningProfileRepository implements ILearningProfileRepository {
  constructor(
    @InjectRepository(LearningProfileEntity)
    private readonly repo: Repository<LearningProfileEntity>,
  ) {}

  async findByUserId(userId: string): Promise<LearningProfile | null> {
    const entity = await this.repo.findOne({ where: { userId } });
    if (!entity) return null;

    return LearningProfile.reconstitute(
      entity.userId,
      entity.streak,
      entity.lastActivityDate,
      entity.totalPoints,
    );
  }

  async save(profile: LearningProfile): Promise<LearningProfile> {
    const entity = this.repo.create({
      userId: profile.id,
      streak: profile.currentStreak,
      lastActivityDate: profile.lastActivity,
      totalPoints: profile.points,
    });

    await this.repo.save(entity);
    return profile;
  }
}
