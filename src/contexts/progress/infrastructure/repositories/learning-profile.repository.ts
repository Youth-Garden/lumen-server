import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfileEntity } from '../entities/learning-profile.entity';

@Injectable()
export class LearningProfileRepository
  extends BaseRepository<LearningProfileEntity>
  implements ILearningProfileRepository
{
  constructor(
    @InjectRepository(LearningProfileEntity)
    private readonly repo: Repository<LearningProfileEntity>,
  ) {
    super(repo);
  }

  async findByUserId(userId: string): Promise<LearningProfile | null> {
    const entity = await this.repo.findOne({ where: { userId } });
    if (!entity) return null;

    const profile = LearningProfile.reconstitute(
      entity.userId,
      entity.streak,
      entity.lastActivityDate,
      entity.totalPoints,
      entity.dailyGoalMinutes,
      entity.streakFreezes || 0,
    );
    if (entity.unlockedBadges) {
      profile.restoreBadges(entity.unlockedBadges);
    }
    return profile;
  }

  async save(profile: LearningProfile): Promise<LearningProfile> {
    let entity = await this.repo.findOne({ where: { userId: profile.id } });
    if (!entity) {
      entity = this.repo.create({
        userId: profile.id,
      });
    }

    entity.streak = profile.currentStreak;
    entity.lastActivityDate = profile.lastActivity;
    entity.totalPoints = profile.points;
    entity.dailyGoalMinutes = profile.dailyGoalMinutes;
    entity.unlockedBadges = profile.unlockedBadges;
    entity.streakFreezes = profile.streakFreezes;

    await this.repo.save(entity);
    return profile;
  }
}
