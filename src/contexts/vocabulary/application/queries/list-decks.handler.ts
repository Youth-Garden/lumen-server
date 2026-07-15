import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(query: ListDecksQuery): Promise<DeckResponseDto[]> {
    const cacheKey = `user_decks_${query.userId}`;
    const cachedDecks =
      await this.cacheManager.get<DeckResponseDto[]>(cacheKey);

    if (cachedDecks) {
      return cachedDecks;
    }

    const decks = await this.vocabularyQueryRepository.findDecksByUserId(
      query.userId,
    );
    await this.cacheManager.set(cacheKey, decks, 300000); // 5 minutes caching

    return decks;
  }
}
