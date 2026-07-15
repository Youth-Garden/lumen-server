import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GrammarExerciseCompletedEvent } from '../../../../shared/domain/events/grammar-exercise-completed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { Activity } from '../../domain/entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';

@EventsHandler(GrammarExerciseCompletedEvent)
export class GrammarExerciseCompletedListener implements IEventHandler<GrammarExerciseCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async handle(event: GrammarExerciseCompletedEvent) {
    let profile = await this.profileRepo.findByUserId(event.aggregateId);

    if (!profile) {
      profile = LearningProfile.create(event.aggregateId);
    }

    // Example points logic: 10 points for completing a grammar exercise correctly
    profile.recordActivity(10);

    await this.profileRepo.save(profile);

    // Log Activity
    const activity = Activity.create(
      uuidv4(),
      event.aggregateId,
      'grammar_completed',
      'Completed Grammar Exercise',
      'Earned 10 XP',
      10,
    );
    await this.activityRepo.save(activity);
  }
}
