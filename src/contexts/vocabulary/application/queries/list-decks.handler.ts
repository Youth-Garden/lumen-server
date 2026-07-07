import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListDecksQuery } from './list-decks.query';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeckEntity } from '../../infrastructure/typeorm/entities/deck.entity';

export class DeckResponseDto {
  id: string;
  name: string;
  description: string | null;
  flashcardCount: number;
}

@QueryHandler(ListDecksQuery)
export class ListDecksHandler implements IQueryHandler<
  ListDecksQuery,
  DeckResponseDto[]
> {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: IDeckRepository,
    @InjectRepository(DeckEntity)
    private readonly deckEntityRepo: Repository<DeckEntity>,
  ) {}

  async execute(query: ListDecksQuery): Promise<DeckResponseDto[]> {
    const { entities, raw } = await this.deckEntityRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.flashcards', 'flashcard')
      .addSelect('COUNT(flashcard.id)', 'flashcardCount')
      .where('deck.authorId = :userId', { userId: query.userId })
      .groupBy('deck.id')
      .orderBy('deck.createdAt', 'DESC')
      .getRawAndEntities();

    return entities.map((deck) => {
      const rawMatch = (
        raw as { deck_id: string; flashcardCount: string }[]
      ).find((r) => r.deck_id === deck.id);
      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        flashcardCount: rawMatch ? parseInt(rawMatch.flashcardCount, 10) : 0,
      };
    });
  }
}
