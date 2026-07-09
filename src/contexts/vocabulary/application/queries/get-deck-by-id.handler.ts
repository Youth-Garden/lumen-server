import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AppException } from '../../../../common/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';
import { GetDeckByIdQuery } from './get-deck-by-id.query';
import { VOCABULARY_QUERY_REPOSITORY } from '../ports/vocabulary-query.repository';
import type { IVocabularyQueryRepository } from '../ports/vocabulary-query.repository';
import { DeckDetailResponseDto } from '../responses/deck.response.dto';

@QueryHandler(GetDeckByIdQuery)
export class GetDeckByIdHandler implements IQueryHandler<
  GetDeckByIdQuery,
  DeckDetailResponseDto
> {
  constructor(
    @Inject(VOCABULARY_QUERY_REPOSITORY)
    private readonly vocabularyQueryRepository: IVocabularyQueryRepository,
  ) {}

  async execute(query: GetDeckByIdQuery): Promise<DeckDetailResponseDto> {
    const deck = await this.vocabularyQueryRepository.findDeckByIdAndUserId(
      query.id,
      query.userId,
    );

    if (!deck) {
      throw new AppException(VocabEx.DeckNotFound);
    }

    return deck;
  }
}
