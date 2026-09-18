import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BatchReviewFlashcardsCommand } from './batch-review-flashcards.command';
import type { IUserProgressRepository } from '../../domain/repositories/user-progress.repository.interface';
import { USER_PROGRESS_REPOSITORY } from '../../domain/repositories/user-progress.repository.interface';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import { UserProgress } from '../../domain/aggregates/user-progress.aggregate';
import { FlashcardReviewedEvent } from '../../../../shared/domain/events/flashcard-reviewed.event';

@CommandHandler(BatchReviewFlashcardsCommand)
export class BatchReviewFlashcardsHandler implements ICommandHandler<
  BatchReviewFlashcardsCommand,
  void
> {
  constructor(
    @Inject(USER_PROGRESS_REPOSITORY)
    private readonly progressRepo: IUserProgressRepository,
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepo: IFlashcardRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: BatchReviewFlashcardsCommand): Promise<void> {
    const { reviews, userId } = command;
    if (!reviews || reviews.length === 0) return;

    for (const item of reviews) {
      const {
        flashcardId,
        isCorrect,
        isFastTrackKnown,
        isFastTrackTempMemory,
      } = item;

      const flashcard = await this.flashcardRepo.findById(flashcardId);
      if (!flashcard) {
        continue;
      }

      let progress = await this.progressRepo.findByUserAndFlashcard(
        userId,
        flashcardId,
      );

      if (!progress) {
        progress = UserProgress.create(userId, flashcardId);
      }

      if (isCorrect || isFastTrackKnown || isFastTrackTempMemory) {
        progress.reviewCorrect(isFastTrackKnown, isFastTrackTempMemory);
      } else {
        progress.reviewWrong();
      }

      await this.progressRepo.save(progress);

      this.eventBus.publish(
        new FlashcardReviewedEvent(userId, flashcardId, isCorrect ? 1 : 0),
      );
    }
  }
}
