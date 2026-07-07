import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDueFlashcardsQuery } from './list-due-flashcards.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { UserProgressEntity } from '../../infrastructure/typeorm/entities/user-progress.entity';

export class DueFlashcardResponseDto {
  flashcardId: string;
  wordId: string;
  term: string;
  deckId: string;
  deckName: string;
  nextReviewDate: Date;
  easeFactor: number;
  repetitions: number;
}

@QueryHandler(ListDueFlashcardsQuery)
export class ListDueFlashcardsHandler implements IQueryHandler<
  ListDueFlashcardsQuery,
  DueFlashcardResponseDto[]
> {
  constructor(
    @InjectRepository(UserProgressEntity)
    private readonly progressRepo: Repository<UserProgressEntity>,
  ) {}

  async execute(
    query: ListDueFlashcardsQuery,
  ): Promise<DueFlashcardResponseDto[]> {
    const progresses = await this.progressRepo.find({
      where: {
        userId: query.userId,
        nextReviewDate: LessThanOrEqual(new Date()),
      },
      relations: {
        flashcard: {
          word: true,
          deck: true,
        },
      },
      order: { nextReviewDate: 'ASC' },
    });

    return progresses.map((p) => ({
      flashcardId: p.flashcard.id,
      wordId: p.flashcard.word.id,
      term: p.flashcard.word.term,
      deckId: p.flashcard.deck.id,
      deckName: p.flashcard.deck.name,
      nextReviewDate: p.nextReviewDate,
      easeFactor: p.easeFactor,
      repetitions: p.repetitions,
    }));
  }
}
