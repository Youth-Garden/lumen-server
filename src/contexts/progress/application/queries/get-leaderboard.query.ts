import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';
import { LeaderboardPeriodEnum } from '../../domain/enums/progress.enum';

export class GetLeaderboardQuery extends PaginatedQuery {
  constructor(
    page?: number,
    limit?: number,
    public readonly period: LeaderboardPeriodEnum = LeaderboardPeriodEnum.ALL_TIME,
    public readonly userId?: string,
  ) {
    super(page, limit);
  }
}
