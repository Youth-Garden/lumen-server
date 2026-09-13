import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { VocabularyOverviewResponseDto } from '../responses/vocabulary-overview.response.dto';
import { GetVocabularyOverviewQuery } from './get-vocabulary-overview.query';

@QueryHandler(GetVocabularyOverviewQuery)
export class GetVocabularyOverviewHandler
  implements
    IQueryHandler<GetVocabularyOverviewQuery, VocabularyOverviewResponseDto>
{
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(
    query: GetVocabularyOverviewQuery,
  ): Promise<VocabularyOverviewResponseDto> {
    return this.vocabularyQueryRepository.getOverview(query.userId);
  }
}
