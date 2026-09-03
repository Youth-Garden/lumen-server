import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
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
    const validUserId = userId && userId !== 'undefined' ? userId : null;

    const queryBuilder = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.flashcards', 'flashcard')
      .select([
        'deck.id AS id',
        'deck.name AS name',
        'deck.description AS description',
        'deck.category AS category',
        'deck.authorId AS "authorId"',
        'COUNT(flashcard.id)::int AS "flashcardCount"',
      ]);

    if (validUserId) {
      queryBuilder.where(
        'deck.authorId = :userId OR deck.category IS NOT NULL',
        { userId: validUserId },
      );
    } else {
      queryBuilder.where('deck.category IS NOT NULL');
    }

    interface RawDeckRow {
      id: string;
      name: string;
      description: string | null;
      category: string | null;
      flashcardCount: number | string;
    }

    const rawResults = await queryBuilder
      .groupBy('deck.id')
      .addGroupBy('deck.name')
      .addGroupBy('deck.description')
      .addGroupBy('deck.category')
      .addGroupBy('deck.authorId')
      .addGroupBy('deck.createdAt')
      .orderBy('deck.createdAt', 'ASC')
      .getRawMany<RawDeckRow>();

    return rawResults.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category || null,
      flashcardCount:
        typeof row.flashcardCount === 'number'
          ? row.flashcardCount
          : parseInt(row.flashcardCount || '0', 10),
    }));
  }

  async findDeckByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<DeckDetailResponseDto | null> {
    if (!id || id === 'undefined') return null;

    const validUserId = userId && userId !== 'undefined' ? userId : null;

    const queryBuilder = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.flashcards', 'flashcard')
      .leftJoinAndSelect('flashcard.word', 'word')
      .leftJoinAndSelect('word.definitions', 'definition')
      .leftJoinAndSelect('definition.examples', 'example');

    if (validUserId) {
      queryBuilder.where(
        'deck.id = :id AND (deck.authorId = :userId OR deck.category IS NOT NULL)',
        { id, userId: validUserId },
      );
    } else {
      queryBuilder.where('deck.id = :id AND deck.category IS NOT NULL', {
        id,
      });
    }

    const deck = await queryBuilder.getOne();

    if (!deck) return null;

    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      category: deck.category || null,
      flashcards: (deck.flashcards || []).map((flashcard) => ({
        id: flashcard.id,
        wordId: flashcard.word.id,
        term: flashcard.word.term,
        phonetic: flashcard.word.phonetic,
        audioUrl: flashcard.word.audioUrl,
        cefrLevel: flashcard.word.cefrLevel,
        imageUrl: flashcard.word.imageUrl,
        definitions: (flashcard.word.definitions || []).map((def) => ({
          id: def.id,
          partOfSpeech: def.partOfSpeech,
          definition:
            (def.definition as unknown as Record<string, string>) || {},
          examples: (def.examples || []).map((ex) => ({
            id: ex.id,
            sentence: (ex.sentence as unknown as Record<string, string>) || {},
          })),
        })),
      })),
    };
  }

  async findDueFlashcards(
    userId: string,
    deckId?: string,
    limit?: number,
  ): Promise<DueFlashcardResponseDto[]> {
    const validUserId = userId && userId !== 'undefined' ? userId : null;
    const validDeckId = deckId && deckId !== 'undefined' ? deckId : null;

    if (!validUserId) return [];

    const where: FindOptionsWhere<UserProgressEntity> = {
      userId: validUserId,
      due: LessThanOrEqual(new Date()),
    };

    if (validDeckId) {
      where.flashcard = {
        deck: {
          id: validDeckId,
        },
      };
    }

    const progresses = await this.progressRepo.find({
      where,
      relations: {
        flashcard: {
          word: true,
          deck: true,
        },
      },
      order: { due: 'ASC' },
      take: limit,
    });

    return progresses.map((progress) => ({
      flashcardId: progress.flashcard.id,
      wordId: progress.flashcard.word.id,
      term: progress.flashcard.word.term,
      deckId: progress.flashcard.deck.id,
      deckName: progress.flashcard.deck.name,
      due: progress.due,
      state: progress.state,
      reps: progress.reps,
    }));
  }
}
