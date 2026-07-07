import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { WordEntity } from './infrastructure/typeorm/entities/word.entity';
import { DefinitionEntity } from './infrastructure/typeorm/entities/definition.entity';
import { ExampleEntity } from './infrastructure/typeorm/entities/example.entity';
import { DeckEntity } from './infrastructure/typeorm/entities/deck.entity';
import { FlashcardEntity } from './infrastructure/typeorm/entities/flashcard.entity';
import { UserProgressEntity } from './infrastructure/typeorm/entities/user-progress.entity';
import { VocabularyController } from './presentation/http/vocabulary.controller';
import { CreateVocabularyWordHandler } from './application/commands/create-vocabulary-word.handler';
import { CreateDeckHandler } from './application/commands/create-deck.handler';
import { CreateFlashcardHandler } from './application/commands/create-flashcard.handler';
import { ReviewFlashcardHandler } from './application/commands/review-flashcard.handler';
import { GetVocabularyWordByIdHandler } from './application/queries/get-vocabulary-word-by-id.handler';
import { VOCABULARY_WORD_REPOSITORY } from './domain/repositories/vocabulary-word.repository.interface';
import { DECK_REPOSITORY } from './domain/repositories/deck.repository.interface';
import { FLASHCARD_REPOSITORY } from './domain/repositories/flashcard.repository.interface';
import { USER_PROGRESS_REPOSITORY } from './domain/repositories/user-progress.repository.interface';
import { VocabularyWordRepository } from './infrastructure/typeorm/repositories/vocabulary-word.repository';
import { DeckRepository } from './infrastructure/typeorm/repositories/deck.repository';
import { FlashcardRepository } from './infrastructure/typeorm/repositories/flashcard.repository';
import { UserProgressRepository } from './infrastructure/typeorm/repositories/user-progress.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      WordEntity,
      DefinitionEntity,
      ExampleEntity,
      DeckEntity,
      FlashcardEntity,
      UserProgressEntity,
    ]),
  ],
  controllers: [VocabularyController],
  providers: [
    CreateVocabularyWordHandler,
    CreateDeckHandler,
    CreateFlashcardHandler,
    ReviewFlashcardHandler,
    GetVocabularyWordByIdHandler,
    {
      provide: VOCABULARY_WORD_REPOSITORY,
      useClass: VocabularyWordRepository,
    },
    {
      provide: DECK_REPOSITORY,
      useClass: DeckRepository,
    },
    {
      provide: FLASHCARD_REPOSITORY,
      useClass: FlashcardRepository,
    },
    {
      provide: USER_PROGRESS_REPOSITORY,
      useClass: UserProgressRepository,
    },
  ],
  exports: [VOCABULARY_WORD_REPOSITORY],
})
export class VocabularyModule {}
