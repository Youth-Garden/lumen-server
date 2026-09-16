import {
  FolderDetailResponseDto,
  FolderFlashcardsResponseDto,
  FolderResponseDto,
} from '../responses/folder.response.dto';
import { FolderTopicResponseDto } from '../responses/folder-topic.response.dto';
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
  findFolderTopics(
    folderId: string,
    userId: string,
  ): Promise<FolderTopicResponseDto[]>;
  findFlashcardsByFolderAndTopic(
    folderId: string,
    userId: string,
    topic?: string,
    page?: number,
    limit?: number,
  ): Promise<FolderFlashcardsResponseDto>;
  findDueFlashcards(
    userId: string,
    folderId?: string,
    limit?: number,
    includeNew?: boolean,
  ): Promise<DueFlashcardResponseDto[]>;
  getOverview(userId: string): Promise<VocabularyOverviewResponseDto>;
}
