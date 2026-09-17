import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';

export class GetNotificationsQuery extends PaginatedQuery {
  constructor(
    public readonly userId: string,
    page?: number,
    limit?: number,
  ) {
    super(page, limit);
  }
}
