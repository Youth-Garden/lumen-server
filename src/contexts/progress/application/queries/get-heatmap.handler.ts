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
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);
    return this.activityRepo.getHeatmapData(query.userId, startDate);
  }
}
