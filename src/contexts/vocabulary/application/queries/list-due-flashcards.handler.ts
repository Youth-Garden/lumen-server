import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListDueFlashcardsQuery } from './list-due-flashcards.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { DueFlashcardResponseDto } from '../responses/due-flashcard.response.dto';

@QueryHandler(ListDueFlashcardsQuery)
export class ListDueFlashcardsHandler implements IQueryHandler<
  ListDueFlashcardsQuery,
  DueFlashcardResponseDto[]
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(
    query: ListDueFlashcardsQuery,
  ): Promise<DueFlashcardResponseDto[]> {
    const validDeckId =
      query.deckId && query.deckId !== 'undefined' ? query.deckId : undefined;

    return this.vocabularyQueryRepository.findDueFlashcards(
      query.userId,
      validDeckId,
      query.limit,
    );
  }
}
