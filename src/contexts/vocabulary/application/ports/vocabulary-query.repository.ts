import {
  FolderDetailResponseDto,
  FolderResponseDto,
} from '../responses/folder.response.dto';
import { DueFlashcardResponseDto } from '../responses/due-flashcard.response.dto';
import { VocabularyOverviewResponseDto } from '../responses/vocabulary-overview.response.dto';

export const VOCABULARY_QUERY_REPOSITORY = Symbol(
  'VOCABULARY_QUERY_REPOSITORY',
);

export interface IVocabularyQueryRepository {
  findFoldersByUserId(userId: string): Promise<FolderResponseDto[]>;
  findFolderByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<FolderDetailResponseDto | null>;
  findDueFlashcards(
    userId: string,
    folderId?: string,
    limit?: number,
    includeNew?: boolean,
  ): Promise<DueFlashcardResponseDto[]>;
  getOverview(userId: string): Promise<VocabularyOverviewResponseDto>;
}
