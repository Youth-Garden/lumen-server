import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserProgressRepository } from '../../domain/repositories/user-progress.repository.interface';
import { UserProgress } from '../../domain/aggregates/user-progress.aggregate';
import { UserProgressEntity } from '../entities/user-progress.entity';
import type { Card } from 'ts-fsrs';

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

    const card: Card = {
      due: entity.due,
      stability: entity.stability,
      difficulty: entity.difficulty,
      elapsed_days: entity.elapsed_days,
      scheduled_days: entity.scheduled_days,
      learning_steps: entity.learning_steps,
      reps: entity.reps,
      lapses: entity.lapses,
      state: entity.state,
      last_review: entity.last_review || undefined,
    };

    return UserProgress.restore(
      entity.id,
      entity.userId,
      entity.flashcardId,
      card,
    );
  }

  async save(progress: UserProgress): Promise<void> {
    const entity = new UserProgressEntity();
    entity.id = progress.id;
    entity.userId = progress.userId;
    entity.flashcardId = progress.flashcardId;

    const card = progress.card;
    entity.due = card.due;
    entity.stability = card.stability;
    entity.difficulty = card.difficulty;
    entity.elapsed_days = card.elapsed_days;
    entity.scheduled_days = card.scheduled_days;
    entity.learning_steps = card.learning_steps;
    entity.reps = card.reps;
    entity.lapses = card.lapses;
    entity.state = card.state;
    entity.last_review = card.last_review || null;

    await this.repo.save(entity);
  }
}
