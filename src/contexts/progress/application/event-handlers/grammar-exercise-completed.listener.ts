import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GrammarExerciseCompletedEvent } from '../../../../shared-kernel/events/grammar-exercise-completed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';

@EventsHandler(GrammarExerciseCompletedEvent)
export class GrammarExerciseCompletedListener implements IEventHandler<GrammarExerciseCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async handle(event: GrammarExerciseCompletedEvent) {
    let profile = await this.profileRepo.findByUserId(event.aggregateId);

    if (!profile) {
      profile = LearningProfile.create(event.aggregateId);
    }

    // Example points logic: 10 points for completing a grammar exercise correctly
    profile.recordActivity(10);

    await this.profileRepo.save(profile);
  }
}
