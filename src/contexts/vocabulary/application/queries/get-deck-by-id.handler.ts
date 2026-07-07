import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppException, VocabEx } from '../../../../shared-kernel/exceptions';
import { GetDeckByIdQuery } from './get-deck-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeckEntity } from '../../infrastructure/typeorm/entities/deck.entity';

export class FlashcardSummaryDto {
  id: string;
  wordId: string;
  term: string;
  cefrLevel: string | null;
}

export class DeckDetailResponseDto {
  id: string;
  name: string;
  description: string | null;
  flashcards: FlashcardSummaryDto[];
}

@QueryHandler(GetDeckByIdQuery)
export class GetDeckByIdHandler implements IQueryHandler<
  GetDeckByIdQuery,
  DeckDetailResponseDto
> {
  constructor(
    @InjectRepository(DeckEntity)
    private readonly deckRepo: Repository<DeckEntity>,
  ) {}

  async execute(query: GetDeckByIdQuery): Promise<DeckDetailResponseDto> {
    const deck = await this.deckRepo.findOne({
      where: { id: query.id, authorId: query.userId },
      relations: {
        flashcards: {
          word: true,
        },
      },
    });

    if (!deck) {
      throw new AppException(VocabEx.DeckNotFound);
    }

    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      flashcards: deck.flashcards.map((f) => ({
        id: f.id,
        wordId: f.word.id,
        term: f.word.term,
        cefrLevel: f.word.cefrLevel,
      })),
    };
  }
}
