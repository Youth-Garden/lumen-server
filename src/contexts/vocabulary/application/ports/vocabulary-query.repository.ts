import {
  FolderDetailResponseDto,
  FolderFlashcardsResponseDto,
  FolderResponseDto,
} from '../responses/folder.response.dto';
import { FolderTopicResponseDto } from '../responses/folder-topic.response.dto';
import { DueWordResponseDto } from '../responses/due-word.response.dto';
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
  findAllTopics(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<FolderTopicResponseDto[]>;
  findFlashcardsByFolderAndTopic(
    folderId: string,
    userId: string,
    topic: string | undefined,
    page: number,
    limit: number,
  ): Promise<FolderFlashcardsResponseDto>;
  findDueWords(
    userId: string,
    folderId: string | undefined,
    page: number,
    limit: number,
    includeNew?: boolean,
  ): Promise<DueWordResponseDto[]>;
  getOverview(userId: string): Promise<VocabularyOverviewResponseDto>;
}
