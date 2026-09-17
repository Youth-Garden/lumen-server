import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';

export class ListFolderFlashcardsQuery extends PaginatedQuery {
  constructor(
    public readonly folderId: string,
    public readonly userId: string,
    public readonly topic?: string,
    page?: number,
    limit?: number,
  ) {
    super(page, limit);
  }
}
