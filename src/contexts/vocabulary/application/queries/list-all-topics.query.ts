import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';

export class ListAllTopicsQuery extends PaginatedQuery {
  constructor(
    public readonly search?: string,
    page = 1,
    limit = 20,
  ) {
    super(page, limit);
  }
}
