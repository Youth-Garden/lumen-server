import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';
import { GetFolderByIdQuery } from './get-folder-by-id.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { FolderDetailResponseDto } from '../responses/folder.response.dto';

@QueryHandler(GetFolderByIdQuery)
export class GetFolderByIdHandler implements IQueryHandler<
  GetFolderByIdQuery,
  FolderDetailResponseDto
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(query: GetFolderByIdQuery): Promise<FolderDetailResponseDto> {
    const folder = await this.vocabularyQueryRepository.findFolderByIdAndUserId(
      query.id,
      query.userId,
    );

    if (!folder) {
      throw new AppException(VocabEx.FolderNotFound);
    }

    return folder;
  }
}
