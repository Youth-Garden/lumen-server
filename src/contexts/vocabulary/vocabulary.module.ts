import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { WordEntity } from './infrastructure/entities/word.entity';
import { DefinitionEntity } from './infrastructure/entities/definition.entity';
import { ExampleEntity } from './infrastructure/entities/example.entity';
import { FolderEntity } from './infrastructure/entities/folder.entity';
import { FlashcardEntity } from './infrastructure/entities/flashcard.entity';
import { UserProgressEntity } from './infrastructure/entities/user-progress.entity';
import { VocabularyController } from './presentation/http/vocabulary.controller';
import { CreateVocabularyWordHandler } from './application/commands/create-vocabulary-word.handler';
import { CreateFolderHandler } from './application/commands/create-folder.handler';
import { CreateFlashcardHandler } from './application/commands/create-flashcard.handler';
import { ReviewFlashcardHandler } from './application/commands/review-flashcard.handler';
import { BatchReviewFlashcardsHandler } from './application/commands/batch-review-flashcards.handler';
import { GetVocabularyWordByIdHandler } from './application/queries/get-vocabulary-word-by-id.handler';
import { ListWordsHandler } from './application/queries/list-words.handler';
import { ListFoldersHandler } from './application/queries/list-folders.handler';
import { GetFolderByIdHandler } from './application/queries/get-folder-by-id.handler';
import { ListDueFlashcardsHandler } from './application/queries/list-due-flashcards.handler';
import { GetVocabularyOverviewHandler } from './application/queries/get-vocabulary-overview.handler';
import { UpdateVocabularyWordHandler } from './application/commands/update-vocabulary-word.handler';
import { DeleteVocabularyWordHandler } from './application/commands/delete-vocabulary-word.handler';
import { UpdateFolderHandler } from './application/commands/update-folder.handler';
import { DeleteFolderHandler } from './application/commands/delete-folder.handler';
import { DeleteFlashcardHandler } from './application/commands/delete-flashcard.handler';
import { ListFolderTopicsHandler } from './application/queries/list-folder-topics.handler';
import { ListFolderFlashcardsHandler } from './application/queries/list-folder-flashcards.handler';
import { VOCABULARY_WORD_REPOSITORY } from './domain/repositories/vocabulary-word.repository.interface';
import { FOLDER_REPOSITORY } from './domain/repositories/folder.repository.interface';
import { FLASHCARD_REPOSITORY } from './domain/repositories/flashcard.repository.interface';
import { USER_PROGRESS_REPOSITORY } from './domain/repositories/user-progress.repository.interface';
import { VocabularyWordRepository } from './infrastructure/repositories/vocabulary-word.repository';
import { FolderRepository } from './infrastructure/repositories/folder.repository';
import { FlashcardRepository } from './infrastructure/repositories/flashcard.repository';
import { UserProgressRepository } from './infrastructure/repositories/user-progress.repository';
import { VOCABULARY_QUERY_REPOSITORY } from './application/ports/vocabulary-query.repository';
import { VocabularyQueryRepository } from './infrastructure/repositories/vocabulary-query.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      WordEntity,
      DefinitionEntity,
      ExampleEntity,
      FolderEntity,
      FlashcardEntity,
      UserProgressEntity,
    ]),
  ],
  controllers: [VocabularyController],
  providers: [
    CreateVocabularyWordHandler,
    CreateFolderHandler,
    CreateFlashcardHandler,
    ReviewFlashcardHandler,
    BatchReviewFlashcardsHandler,
    GetVocabularyWordByIdHandler,
    ListWordsHandler,
    ListFoldersHandler,
    GetFolderByIdHandler,
    ListDueFlashcardsHandler,
    GetVocabularyOverviewHandler,
    UpdateVocabularyWordHandler,
    DeleteVocabularyWordHandler,
    UpdateFolderHandler,
    DeleteFolderHandler,
    DeleteFlashcardHandler,
    ListFolderTopicsHandler,
    ListFolderFlashcardsHandler,
    {
      provide: VOCABULARY_WORD_REPOSITORY,
      useClass: VocabularyWordRepository,
    },
    {
      provide: FOLDER_REPOSITORY,
      useClass: FolderRepository,
    },
    {
      provide: FLASHCARD_REPOSITORY,
      useClass: FlashcardRepository,
    },
    {
      provide: USER_PROGRESS_REPOSITORY,
      useClass: UserProgressRepository,
    },
    {
      provide: VOCABULARY_QUERY_REPOSITORY,
      useClass: VocabularyQueryRepository,
    },
  ],
  exports: [VOCABULARY_WORD_REPOSITORY],
})
export class VocabularyModule {}
