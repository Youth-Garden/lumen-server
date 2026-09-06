import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListFoldersQuery } from './list-folders.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { FolderResponseDto } from '../responses/folder.response.dto';

@QueryHandler(ListFoldersQuery)
export class ListFoldersHandler implements IQueryHandler<
  ListFoldersQuery,
  FolderResponseDto[]
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(query: ListFoldersQuery): Promise<FolderResponseDto[]> {
    return this.vocabularyQueryRepository.findFoldersByUserId(query.userId);
  }
}
