import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';

export class ListDueWordsQuery extends PaginatedQuery {
  constructor(
    public readonly userId: string,
    public readonly folderId?: string,
    page: number = 1,
    limit: number = 20,
    public readonly includeNew?: boolean,
  ) {
    super(page, limit);
  }
}
