import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FlashcardReviewedEvent } from '../../../../shared-kernel/events/flashcard-reviewed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';

@EventsHandler(FlashcardReviewedEvent)
export class FlashcardReviewedListener implements IEventHandler<FlashcardReviewedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async handle(event: FlashcardReviewedEvent) {
    let profile = await this.profileRepo.findByUserId(event.userId);

    if (!profile) {
      profile = LearningProfile.create(event.userId);
    }

    // Example points logic: 1 point for every flashcard reviewed
    const pointsEarned = 1;
    profile.recordActivity(pointsEarned);

    await this.profileRepo.save(profile);
  }
}
