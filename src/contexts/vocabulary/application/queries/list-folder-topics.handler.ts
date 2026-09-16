import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListFolderTopicsQuery } from './list-folder-topics.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { FolderTopicResponseDto } from '../responses/folder-topic.response.dto';

@QueryHandler(ListFolderTopicsQuery)
export class ListFolderTopicsHandler implements IQueryHandler<
  ListFolderTopicsQuery,
  FolderTopicResponseDto[]
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(
    query: ListFolderTopicsQuery,
  ): Promise<FolderTopicResponseDto[]> {
    return this.vocabularyQueryRepository.findFolderTopics(
      query.folderId,
      query.userId,
    );
  }
}
