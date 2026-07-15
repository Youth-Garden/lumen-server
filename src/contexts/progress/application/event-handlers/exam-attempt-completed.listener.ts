import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { ExamAttemptCompletedEvent } from '../../../exam-practice/domain/events/exam-attempt-completed.event';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { XP_PER_TOEIC_SCORE_POINT } from '../../domain/constants/progress.constants';
import { Activity } from '../../domain/entities/activity.entity';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';

@EventsHandler(ExamAttemptCompletedEvent)
export class ExamAttemptCompletedListener implements IEventHandler<ExamAttemptCompletedEvent> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async handle(event: ExamAttemptCompletedEvent): Promise<void> {
    let profile = await this.profileRepo.findByUserId(event.userId);

    if (!profile) {
      profile = LearningProfile.create(event.userId);
    }

    const xpEarned = Math.round(event.totalScore * XP_PER_TOEIC_SCORE_POINT);
    profile.recordActivity(xpEarned);
    await this.profileRepo.save(profile);

    const activity = Activity.create(
      uuidv4(),
      event.userId,
      'toeic_exam_completed',
      'Completed TOEIC Practice Test',
      `Score: ${event.totalScore} — XP earned: ${xpEarned}`,
      xpEarned,
    );
    await this.activityRepo.save(activity);
  }
}
