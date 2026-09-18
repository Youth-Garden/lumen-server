import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FlashcardReviewedEvent } from '../../../../shared/domain/events/flashcard-reviewed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { Activity } from '../../domain/entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';

@EventsHandler(FlashcardReviewedEvent)
export class FlashcardReviewedListener implements IEventHandler<FlashcardReviewedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
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

    // Log Activity
    const activity = Activity.create(
      uuidv4(),
      event.userId,
      'flashcard_reviewed',
      'Reviewed Flashcard',
      'Earned 1 XP',
      pointsEarned,
      1,
    );
    await this.activityRepo.save(activity);
  }
}
