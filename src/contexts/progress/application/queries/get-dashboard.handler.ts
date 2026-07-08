import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDashboardQuery } from './get-dashboard.query';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { DashboardResponseDto } from '../dtos/dashboard.response.dto';

@QueryHandler(GetDashboardQuery)
export class GetDashboardHandler implements IQueryHandler<
  GetDashboardQuery,
  DashboardResponseDto
> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async execute(query: GetDashboardQuery): Promise<DashboardResponseDto> {
    const profile = await this.profileRepo.findByUserId(query.userId);

    if (!profile) {
      return new DashboardResponseDto(0, null, 0, 15);
    }

    return new DashboardResponseDto(
      profile.currentStreak,
      profile.lastActivity,
      profile.points,
      profile.dailyGoalMinutes,
    );
  }
}
