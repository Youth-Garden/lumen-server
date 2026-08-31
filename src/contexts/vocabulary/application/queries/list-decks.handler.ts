import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListDecksQuery } from './list-decks.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { DeckResponseDto } from '../responses/deck.response.dto';

@QueryHandler(ListDecksQuery)
export class ListDecksHandler implements IQueryHandler<
  ListDecksQuery,
  DeckResponseDto[]
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(query: ListDecksQuery): Promise<DeckResponseDto[]> {
    return this.vocabularyQueryRepository.findDecksByUserId(query.userId);
  }
}
