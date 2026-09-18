import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDashboardQuery } from './get-dashboard.query';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { DashboardResponseDto } from '../responses/dashboard.response.dto';

@QueryHandler(GetDashboardQuery)
export class GetDashboardHandler implements IQueryHandler<
  GetDashboardQuery,
  DashboardResponseDto
> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async execute(query: GetDashboardQuery): Promise<DashboardResponseDto> {
    const profile = await this.profileRepo.findByUserId(query.userId);
    const todayActivities = await this.activityRepo.findTodayActivities(
      query.userId,
    );
    const todayStudyMinutes = todayActivities.reduce(
      (sum, activity) => sum + (activity.durationMinutes || 1),
      0,
    );

    if (!profile) {
      return new DashboardResponseDto(0, null, 0, 15, todayStudyMinutes, [], 0);
    }

    if (profile.syncStreak()) {
      await this.profileRepo.save(profile);
    }

    return new DashboardResponseDto(
      profile.currentStreak,
      profile.lastActivity,
      profile.points,
      profile.dailyGoalMinutes,
      todayStudyMinutes,
      profile.unlockedBadges,
      profile.streakFreezes,
    );
  }
}
