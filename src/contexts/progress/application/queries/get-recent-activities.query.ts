import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';

export class GetRecentActivitiesQuery extends PaginatedQuery {
  constructor(
    public readonly userId: string,
    page?: number,
    limit?: number,
  ) {
    super(page, limit);
  }
}
