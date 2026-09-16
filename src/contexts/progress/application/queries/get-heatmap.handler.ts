import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetHeatmapQuery } from './get-heatmap.query';
import { ACTIVITY_REPOSITORY } from '../../domain/repositories/activity.repository.interface';
import type { IActivityRepository } from '../../domain/repositories/activity.repository.interface';

@QueryHandler(GetHeatmapQuery)
export class GetHeatmapHandler implements IQueryHandler<GetHeatmapQuery> {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async execute(
    query: GetHeatmapQuery,
  ): Promise<{ date: string; count: number }[]> {
    if (query.year) {
      const startDate = new Date(query.year, 0, 1, 0, 0, 0, 0);
      const endDate = new Date(query.year, 11, 31, 23, 59, 59, 999);
      return this.activityRepo.getHeatmapData(query.userId, startDate, endDate);
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);
    return this.activityRepo.getHeatmapData(query.userId, startDate);
  }
}
