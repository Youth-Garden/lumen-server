import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QuizCompletedEvent } from '../../../../shared-kernel/events/quiz-completed.event';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { Activity } from '../../domain/entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';

@EventsHandler(QuizCompletedEvent)
export class QuizCompletedListener implements IEventHandler<QuizCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
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

    // Log Activity
    const activity = Activity.create(
      uuidv4(),
      event.userId,
      'quiz_completed',
      'Completed Quiz',
      `Score: ${event.score}`,
      pointsEarned,
    );
    await this.activityRepo.save(activity);
  }
}
