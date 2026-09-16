import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListFolderFlashcardsQuery } from './list-folder-flashcards.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { FolderFlashcardsResponseDto } from '../responses/folder.response.dto';

@QueryHandler(ListFolderFlashcardsQuery)
export class ListFolderFlashcardsHandler implements IQueryHandler<
  ListFolderFlashcardsQuery,
  FolderFlashcardsResponseDto
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(
    query: ListFolderFlashcardsQuery,
  ): Promise<FolderFlashcardsResponseDto> {
    return this.vocabularyQueryRepository.findFlashcardsByFolderAndTopic(
      query.folderId,
      query.userId,
      query.topic,
      query.page,
      query.limit,
    );
  }
}
