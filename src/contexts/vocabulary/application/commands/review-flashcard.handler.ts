import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { ReviewFlashcardCommand } from './review-flashcard.command';
import type { IUserProgressRepository } from '../../domain/repositories/user-progress.repository.interface';
import { USER_PROGRESS_REPOSITORY } from '../../domain/repositories/user-progress.repository.interface';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import { UserProgress } from '../../domain/aggregates/user-progress.aggregate';
import { randomUUID } from 'crypto';

@CommandHandler(ReviewFlashcardCommand)
export class ReviewFlashcardHandler implements ICommandHandler<
  ReviewFlashcardCommand,
  void
> {
  constructor(
    @Inject(USER_PROGRESS_REPOSITORY)
    private readonly progressRepo: IUserProgressRepository,
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepo: IFlashcardRepository,
  ) {}

  async execute(command: ReviewFlashcardCommand): Promise<void> {
    const { dto, userId } = command;

    const flashcard = await this.flashcardRepo.findById(dto.flashcardId);
    if (!flashcard) {
      throw new BadRequestException('Flashcard not found');
    }

    let progress = await this.progressRepo.findByUserAndFlashcard(
      userId,
      dto.flashcardId,
    );

    if (!progress) {
      progress = UserProgress.create(randomUUID(), userId, dto.flashcardId);
    }

    // Apply Domain Logic (SM-2 Algorithm)
    progress.review(dto.grade);

    await this.progressRepo.save(progress);
  }
}
