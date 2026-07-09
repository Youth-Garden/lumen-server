import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SpeakingTaskCompletedEvent } from '../../../../shared-kernel/events/speaking-task-completed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';

@EventsHandler(SpeakingTaskCompletedEvent)
export class SpeakingTaskCompletedListener implements IEventHandler<SpeakingTaskCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async handle(event: SpeakingTaskCompletedEvent) {
    let profile = await this.profileRepo.findByUserId(event.aggregateId);

    if (!profile) {
      profile = LearningProfile.create(event.aggregateId);
    }

    // Example points logic: 15 points for completing a speaking task
    profile.recordActivity(15);

    await this.profileRepo.save(profile);
  }
}
