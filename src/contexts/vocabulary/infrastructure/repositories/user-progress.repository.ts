import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { IUserProgressRepository } from '../../domain/repositories/user-progress.repository.interface';
import { UserProgress } from '../../domain/aggregates/user-progress.aggregate';
import { UserProgressEntity } from '../entities/user-progress.entity';

@Injectable()
export class UserProgressRepository
  extends BaseRepository<UserProgressEntity>
  implements IUserProgressRepository
{
  constructor(
    @InjectRepository(UserProgressEntity)
    private readonly repo: Repository<UserProgressEntity>,
  ) {
    super(repo);
  }

  async findByUserAndFlashcard(
    userId: string,
    flashcardId: string,
  ): Promise<UserProgress | null> {
    const entity = await this.repo.findOne({ where: { userId, flashcardId } });
    if (!entity) return null;
    return this.toAggregate(entity);
  }

  async findManyByUserAndFlashcards(
    userId: string,
    flashcardIds: string[],
  ): Promise<Map<string, UserProgress>> {
    if (flashcardIds.length === 0) return new Map();
    const entities = await this.repo.find({
      where: { userId, flashcardId: In(flashcardIds) },
    });
    const result = new Map<string, UserProgress>();
    for (const entity of entities) {
      result.set(entity.flashcardId, this.toAggregate(entity));
    }
    return result;
  }

  async save(progress: UserProgress): Promise<void> {
    const entity = new UserProgressEntity();
    entity.id = progress.id;
    entity.userId = progress.userId;
    entity.flashcardId = progress.flashcardId;
    entity.masteryScore = progress.masteryScore;
    entity.level = progress.level;
    entity.isWilted = progress.isWilted;
    entity.learningStep = progress.learningStep;
    entity.reviewCountAtCurrentLevel = progress.reviewCountAtCurrentLevel;
    entity.intervalDays = progress.intervalDays;
    entity.lastReviewedAt = progress.lastReviewedAt;
    entity.nextReviewAt = progress.nextReviewAt;
    await this.repo.save(entity);
  }

  private toAggregate(entity: UserProgressEntity): UserProgress {
    return UserProgress.restore(
      entity.id,
      entity.userId,
      entity.flashcardId,
      entity.masteryScore,
      entity.level,
      entity.isWilted,
      entity.learningStep,
      entity.reviewCountAtCurrentLevel,
      entity.intervalDays,
      entity.lastReviewedAt,
      entity.nextReviewAt,
    );
  }
}
