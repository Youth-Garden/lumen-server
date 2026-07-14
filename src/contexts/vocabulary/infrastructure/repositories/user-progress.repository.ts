import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    return UserProgress.restore(
      entity.id,
      entity.userId,
      entity.flashcardId,
      entity.easeFactor,
      entity.interval,
      entity.repetitions,
      entity.nextReviewDate,
    );
  }

  async save(progress: UserProgress): Promise<void> {
    const entity = new UserProgressEntity();
    entity.id = progress.id;
    entity.userId = progress.userId;
    entity.flashcardId = progress.flashcardId;
    entity.easeFactor = progress.easeFactor;
    entity.interval = progress.interval;
    entity.repetitions = progress.repetitions;
    entity.nextReviewDate = progress.nextReviewDate;

    await this.repo.save(entity);
  }
}
