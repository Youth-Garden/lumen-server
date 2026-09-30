import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { FlashcardReviewedEvent } from '../../../../shared/domain/events/flashcard-reviewed.event';
import { UserProgress } from '../../domain/aggregates/user-progress.aggregate';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import type { IUserProgressRepository } from '../../domain/repositories/user-progress.repository.interface';
import { USER_PROGRESS_REPOSITORY } from '../../domain/repositories/user-progress.repository.interface';
import { BatchReviewFlashcardsCommand } from './batch-review-flashcards.command';

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

    const flashcardIds = reviews.map((r) => r.flashcardId);

    const [flashcards, progressMap] = await Promise.all([
      this.flashcardRepo.findManyByIds(flashcardIds),
      this.progressRepo.findManyByUserAndFlashcards(userId, flashcardIds),
    ]);

    for (const item of reviews) {
      const {
        flashcardId,
        isCorrect,
        isFastTrackKnown,
        isFastTrackTempMemory,
        isResetToUnlearned,
      } = item;

      if (!flashcards.has(flashcardId)) continue;

      const progress =
        progressMap.get(flashcardId) ??
        UserProgress.create(userId, flashcardId);

      if (isResetToUnlearned) {
        progress.resetToUnlearned();
      } else if (isCorrect || isFastTrackKnown || isFastTrackTempMemory) {
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
