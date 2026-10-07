import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDashboardQuery } from './get-dashboard.query';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import {
  DashboardResponseDto,
  DailyGoalHistoryItemDto,
} from '../responses/dashboard.response.dto';
import { DailyGoalHistoryEntity } from '../../infrastructure/entities/daily-goal-history.entity';

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
    @InjectRepository(DailyGoalHistoryEntity)
    private readonly goalHistoryRepo: Repository<DailyGoalHistoryEntity>,
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

    const hasTodayActivities =
      todayActivities.length > 0 || todayStudyMinutes > 0;

    let rawHistories = await this.goalHistoryRepo.find({
      where: { userId: query.userId },
      order: { effectiveFrom: 'ASC' },
    });

    if (rawHistories.length === 0) {
      const initialGoal = profile ? profile.dailyGoalMinutes : 15;
      const initialHistory = this.goalHistoryRepo.create({
        userId: query.userId,
        targetMinutes: initialGoal,
        effectiveFrom: new Date(2020, 0, 1),
        effectiveTo: null,
      });
      await this.goalHistoryRepo.save(initialHistory);
      rawHistories = [initialHistory];
    }

    const mappedHistories: DailyGoalHistoryItemDto[] = rawHistories.map(
      (h) => ({
        targetMinutes: h.targetMinutes,
        effectiveFrom: h.effectiveFrom.toISOString(),
        effectiveTo: h.effectiveTo ? h.effectiveTo.toISOString() : null,
      }),
    );

    if (!profile) {
      const newProfile = LearningProfile.create(query.userId);
      if (hasTodayActivities) {
        newProfile.recordActivity(0);
      }
      await this.profileRepo.save(newProfile);
      return new DashboardResponseDto(
        newProfile.currentStreak,
        newProfile.lastActivity,
        newProfile.points,
        newProfile.dailyGoalMinutes,
        todayStudyMinutes,
        newProfile.unlockedBadges,
        newProfile.streakFreezes,
        mappedHistories,
        newProfile.frozenDates,
      );
    }

    if (profile.syncStreak(new Date(), hasTodayActivities)) {
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
      mappedHistories,
      profile.frozenDates,
    );
  }
}
