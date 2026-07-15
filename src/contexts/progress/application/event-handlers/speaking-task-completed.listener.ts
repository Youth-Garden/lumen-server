import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { SpeakingTaskCompletedEvent } from '../../../../shared/domain/events/speaking-task-completed.event';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { Activity } from '../../domain/entities/activity.entity';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';

@EventsHandler(SpeakingTaskCompletedEvent)
export class SpeakingTaskCompletedListener implements IEventHandler<SpeakingTaskCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async handle(event: SpeakingTaskCompletedEvent) {
    let profile = await this.profileRepo.findByUserId(event.aggregateId);

    if (!profile) {
      profile = LearningProfile.create(event.aggregateId);
    }

    // Example points logic: 15 points for completing a speaking task
    profile.recordActivity(15);

    await this.profileRepo.save(profile);

    // Log Activity
    const activity = Activity.create(
      uuidv4(),
      event.aggregateId,
      'speaking_completed',
      'Completed Speaking Task',
      'Earned 15 XP',
      15,
    );
    await this.activityRepo.save(activity);
  }
}
