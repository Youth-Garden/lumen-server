import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetRecentActivitiesQuery } from './get-recent-activities.query';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';

import { ActivityResponseDto } from '../responses/activity.response.dto';

@QueryHandler(GetRecentActivitiesQuery)
export class GetRecentActivitiesHandler implements IQueryHandler<
  GetRecentActivitiesQuery,
  ActivityResponseDto[]
> {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async execute(
    query: GetRecentActivitiesQuery,
  ): Promise<ActivityResponseDto[]> {
    const activities = await this.activityRepo.findByUserId(
      query.userId,
      query.limit,
    );

    return activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      xpEarned: activity.xpEarned,
      timestamp: activity.timestamp,
    }));
  }
}
