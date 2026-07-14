import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import type { IVocabularyQueryRepository } from '../../application/ports/vocabulary-query.repository';
import {
  DeckDetailResponseDto,
  DeckResponseDto,
} from '../../application/responses/deck.response.dto';
import { DueFlashcardResponseDto } from '../../application/responses/due-flashcard.response.dto';
import { DeckEntity } from '../entities/deck.entity';
import { UserProgressEntity } from '../entities/user-progress.entity';

@Injectable()
export class VocabularyQueryRepository
  extends BaseRepository<DeckEntity>
  implements IVocabularyQueryRepository
{
  constructor(
    @InjectRepository(DeckEntity)
    private readonly deckRepo: Repository<DeckEntity>,
    @InjectRepository(UserProgressEntity)
    private readonly progressRepo: Repository<UserProgressEntity>,
  ) {
    super(deckRepo);
  }

  async findDecksByUserId(userId: string): Promise<DeckResponseDto[]> {
    const { entities, raw } = await this.deckRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.flashcards', 'flashcard')
      .addSelect('COUNT(flashcard.id)', 'flashcardCount')
      .where('deck.authorId = :userId', { userId })
      .groupBy('deck.id')
      .orderBy('deck.createdAt', 'DESC')
      .getRawAndEntities();

    return entities.map((deck) => {
      const rawMatch = (
        raw as { deck_id: string; flashcardCount: string }[]
      ).find((row) => row.deck_id === deck.id);

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        flashcardCount: rawMatch ? parseInt(rawMatch.flashcardCount, 10) : 0,
      };
    });
  }

  async findDeckByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<DeckDetailResponseDto | null> {
    const deck = await this.deckRepo.findOne({
      where: { id, authorId: userId },
      relations: {
        flashcards: {
          word: true,
        },
      },
    });

    if (!deck) return null;

    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      flashcards: deck.flashcards.map((flashcard) => ({
        id: flashcard.id,
        wordId: flashcard.word.id,
        term: flashcard.word.term,
        cefrLevel: flashcard.word.cefrLevel,
      })),
    };
  }

  async findDueFlashcards(userId: string): Promise<DueFlashcardResponseDto[]> {
    const progresses = await this.progressRepo.find({
      where: {
        userId,
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

    return progresses.map((progress) => ({
      flashcardId: progress.flashcard.id,
      wordId: progress.flashcard.word.id,
      term: progress.flashcard.word.term,
      deckId: progress.flashcard.deck.id,
      deckName: progress.flashcard.deck.name,
      nextReviewDate: progress.nextReviewDate,
      easeFactor: progress.easeFactor,
      repetitions: progress.repetitions,
    }));
  }
}
