import { BaseFilterQuery } from '../../../../shared/application/cqrs/base-filter.query';
import { SortOrder } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListWordsQuery extends BaseFilterQuery {
  constructor(
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: SortOrder,
    public readonly cefrLevel?: string,
    public readonly partOfSpeech?: string,
  ) {
    super(page, limit, search, sortBy, sortOrder);
  }
}
