import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import type { IVocabularyQueryRepository } from '../../application/ports/vocabulary-query.repository';
import { DueFlashcardResponseDto } from '../../application/responses/due-flashcard.response.dto';
import {
  FolderDetailResponseDto,
  FolderResponseDto,
} from '../../application/responses/folder.response.dto';
import { FlashcardEntity } from '../entities/flashcard.entity';
import { FolderEntity } from '../entities/folder.entity';
import { UserProgressEntity } from '../entities/user-progress.entity';

@Injectable()
export class VocabularyQueryRepository
  extends BaseRepository<FolderEntity>
  implements IVocabularyQueryRepository
{
  constructor(
    @InjectRepository(FolderEntity)
    private readonly folderRepo: Repository<FolderEntity>,
    @InjectRepository(UserProgressEntity)
    private readonly progressRepo: Repository<UserProgressEntity>,
    @InjectRepository(FlashcardEntity)
    private readonly flashcardRepo: Repository<FlashcardEntity>,
  ) {
    super(folderRepo);
  }

  async findFoldersByUserId(userId: string): Promise<FolderResponseDto[]> {
    const validUserId = userId && userId !== 'undefined' ? userId : null;

    const queryBuilder = this.folderRepo
      .createQueryBuilder('folder')
      .leftJoin('folder.flashcards', 'flashcard')
      .select([
        'folder.id AS id',
        'folder.name AS name',
        'folder.description AS description',
        'folder.category AS category',
        'folder.authorId AS "authorId"',
        'COUNT(flashcard.id)::int AS "flashcardCount"',
      ]);

    if (validUserId) {
      queryBuilder.where(
        'folder.authorId = :userId OR folder.category IS NOT NULL',
        { userId: validUserId },
      );
    } else {
      queryBuilder.where('folder.category IS NOT NULL');
    }

    interface RawFolderRow {
      id: string;
      name: string;
      description: string | null;
      category: string | null;
      flashcardCount: number | string;
    }

    const rawResults = await queryBuilder
      .groupBy('folder.id')
      .addGroupBy('folder.name')
      .addGroupBy('folder.description')
      .addGroupBy('folder.category')
      .addGroupBy('folder.authorId')
      .addGroupBy('folder.createdAt')
      .orderBy('folder.createdAt', 'ASC')
      .getRawMany<RawFolderRow>();

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

  async findFolderByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<FolderDetailResponseDto | null> {
    if (!id || id === 'undefined') return null;

    const validUserId = userId && userId !== 'undefined' ? userId : null;

    const queryBuilder = this.folderRepo
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.flashcards', 'flashcard')
      .leftJoinAndSelect('flashcard.word', 'word')
      .leftJoinAndSelect('word.definitions', 'definition')
      .leftJoinAndSelect('definition.examples', 'example');

    if (validUserId) {
      queryBuilder.where(
        'folder.id = :id AND (folder.authorId = :userId OR folder.category IS NOT NULL)',
        { id, userId: validUserId },
      );
    } else {
      queryBuilder.where('folder.id = :id AND folder.category IS NOT NULL', {
        id,
      });
    }

    const folder = await queryBuilder.getOne();

    if (!folder) return null;

    return {
      id: folder.id,
      name: folder.name,
      description: folder.description,
      category: folder.category || null,
      flashcards: (folder.flashcards || []).map((flashcard) => ({
        id: flashcard.id,
        wordId: flashcard.word.id,
        term: flashcard.word.term,
        topic: flashcard.word.topic || null,
        topicVi: flashcard.word.topicVi || null,
        topicImageUrl: flashcard.word.topicImageUrl || null,
        phonetic: flashcard.word.phonetic,
        phoneticUs: flashcard.word.phoneticUs,
        phoneticUk: flashcard.word.phoneticUk,
        audioUrl: flashcard.word.audioUrl,
        audioUsUrl: flashcard.word.audioUsUrl,
        audioUkUrl: flashcard.word.audioUkUrl,
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
    folderId?: string,
    limit?: number,
  ): Promise<DueFlashcardResponseDto[]> {
    const validUserId = userId && userId !== 'undefined' ? userId : null;
    const validFolderId =
      folderId && folderId !== 'undefined' ? folderId : null;

    if (!validUserId) return [];

    // Query flashcards, LEFT JOIN user progress for this specific user
    const qb = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .leftJoinAndSelect('flashcard.word', 'word')
      .leftJoinAndSelect('flashcard.folder', 'folder')
      .leftJoinAndSelect(
        'vocab_user_progress',
        'progress',
        'progress."flashcardId" = flashcard.id AND progress."userId" = :userId',
        { userId: validUserId },
      );

    if (validFolderId) {
      qb.andWhere('folder.id = :folderId', { folderId: validFolderId });
    }

    // A flashcard is due if:
    // 1. It has NO progress (new word)
    // OR 2. It has progress and nextReviewAt <= NOW
    qb.andWhere('(progress.id IS NULL OR progress."nextReviewAt" <= :now)', {
      now: new Date(),
    });

    // Order by new words first, then by earliest due date
    qb.orderBy('progress.id', 'ASC', 'NULLS FIRST').addOrderBy(
      'progress."nextReviewAt"',
      'ASC',
      'NULLS FIRST',
    );

    if (limit) {
      qb.limit(limit);
    }

    const rawResults = await qb.getRawMany();

    return rawResults.map((row) => ({
      flashcardId: row.flashcard_id,
      wordId: row.word_id,
      term: row.word_term,
      folderId: row.folder_id,
      folderName: row.folder_name,
      masteryScore: row.progress_masteryScore ?? 0,
      level: row.progress_level ?? 0,
      isWilted: row.progress_isWilted ?? false,
      learningStep: row.progress_learningStep ?? 0,
      reviewCountAtCurrentLevel: row.progress_reviewCountAtCurrentLevel ?? 0,
      intervalDays: row.progress_intervalDays ?? 0,
      nextReviewAt: row.progress_nextReviewAt || null,
    }));
  }
}
