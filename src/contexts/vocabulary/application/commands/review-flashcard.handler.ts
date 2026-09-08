import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ReviewFlashcardCommand } from './review-flashcard.command';
import type { IUserProgressRepository } from '../../domain/repositories/user-progress.repository.interface';
import { USER_PROGRESS_REPOSITORY } from '../../domain/repositories/user-progress.repository.interface';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import { UserProgress } from '../../domain/aggregates/user-progress.aggregate';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';
import { FlashcardReviewedEvent } from '../../../../shared/domain/events/flashcard-reviewed.event';

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
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReviewFlashcardCommand): Promise<void> {
    const {
      flashcardId,
      isCorrect,
      isFastTrackKnown,
      isFastTrackTempMemory,
      userId,
    } = command;

    const flashcard = await this.flashcardRepo.findById(flashcardId);
    if (!flashcard) {
      throw new AppException(VocabEx.FlashcardNotFound);
    }

    let progress = await this.progressRepo.findByUserAndFlashcard(
      userId,
      flashcardId,
    );

    if (!progress) {
      progress = UserProgress.create(userId, flashcardId);
    }

    // Apply Domain Logic (Custom SRS Algorithm)
    if (isCorrect || isFastTrackKnown || isFastTrackTempMemory) {
      progress.reviewCorrect(isFastTrackKnown, isFastTrackTempMemory);
    } else {
      progress.reviewWrong();
    }

    await this.progressRepo.save(progress);

    // Using isCorrect instead of quality as the 3rd param for the event
    this.eventBus.publish(
      new FlashcardReviewedEvent(userId, flashcardId, isCorrect ? 1 : 0),
    );
  }
}
