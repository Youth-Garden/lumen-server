import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListAllTopicsQuery } from './list-all-topics.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { FolderTopicResponseDto } from '../responses/folder-topic.response.dto';

@QueryHandler(ListAllTopicsQuery)
export class ListAllTopicsHandler implements IQueryHandler<
  ListAllTopicsQuery,
  FolderTopicResponseDto[]
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(query: ListAllTopicsQuery): Promise<FolderTopicResponseDto[]> {
    return this.vocabularyQueryRepository.findAllTopics(
      query.search,
      query.page,
      query.limit,
    );
  }
}
