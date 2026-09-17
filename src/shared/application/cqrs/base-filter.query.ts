import { SortOrder } from '../../presentation/dtos/pagination.dto';
import { PaginatedQuery } from './paginated.query';

export abstract class BaseFilterQuery extends PaginatedQuery {
  constructor(
    page?: number,
    limit?: number,
    public readonly search?: string,
    public readonly sortBy?: string,
    public readonly sortOrder?: SortOrder,
  ) {
    super(page, limit);
  }
}
