import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListDueWordsQuery } from './list-due-words.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { DueWordResponseDto } from '../responses/due-word.response.dto';

@QueryHandler(ListDueWordsQuery)
export class ListDueWordsHandler implements IQueryHandler<
  ListDueWordsQuery,
  DueWordResponseDto[]
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(query: ListDueWordsQuery): Promise<DueWordResponseDto[]> {
    const validFolderId =
      query.folderId && query.folderId !== 'undefined'
        ? query.folderId
        : undefined;

    return this.vocabularyQueryRepository.findDueWords(
      query.userId,
      validFolderId,
      query.page,
      query.limit,
      query.includeNew,
    );
  }
}
