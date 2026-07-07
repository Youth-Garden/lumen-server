import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QuizCompletedEvent } from '../../../../shared-kernel/events/quiz-completed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';

@EventsHandler(QuizCompletedEvent)
export class QuizCompletedListener implements IEventHandler<QuizCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async handle(event: QuizCompletedEvent) {
    let profile = await this.profileRepo.findByUserId(event.userId);

    if (!profile) {
      profile = LearningProfile.create(event.userId);
    }

    // Example points logic: quiz score
    const pointsEarned = event.score;
    profile.recordActivity(pointsEarned);

    await this.profileRepo.save(profile);
  }
}
