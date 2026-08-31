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
    const queryBuilder = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.flashcards', 'flashcard')
      .addSelect('COUNT(flashcard.id)', 'flashcardCount');

    if (userId) {
      queryBuilder.where(
        'deck.authorId = :userId OR deck.category IS NOT NULL',
        { userId },
      );
    } else {
      queryBuilder.where('deck.category IS NOT NULL');
    }

    const { entities, raw } = await queryBuilder
      .groupBy('deck.id')
      .orderBy('deck.createdAt', 'ASC')
      .getRawAndEntities();

    return entities.map((deck) => {
      const rawMatch = (
        raw as { deck_id: string; flashcardCount: string }[]
      ).find((row) => row.deck_id === deck.id);

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        category: deck.category || null,
        flashcardCount: rawMatch ? parseInt(rawMatch.flashcardCount, 10) : 0,
      };
    });
  }

  async findDeckByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<DeckDetailResponseDto | null> {
    const queryBuilder = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.flashcards', 'flashcard')
      .leftJoinAndSelect('flashcard.word', 'word')
      .leftJoinAndSelect('word.definitions', 'definition')
      .leftJoinAndSelect('definition.examples', 'example');

    if (userId) {
      queryBuilder.where(
        'deck.id = :id AND (deck.authorId = :userId OR deck.category IS NOT NULL)',
        { id, userId },
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
        definitions: (flashcard.word.definitions || []).map((def) => ({
          id: def.id,
          partOfSpeech: def.partOfSpeech,
          definition: (def.definition as unknown as Record<string, string>) || {},
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
    const where: FindOptionsWhere<UserProgressEntity> = {
      userId,
      due: LessThanOrEqual(new Date()),
    };

    if (deckId) {
      where.flashcard = {
        deck: {
          id: deckId,
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
