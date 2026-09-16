import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import type { IVocabularyQueryRepository } from '../../application/ports/vocabulary-query.repository';
import { DueFlashcardResponseDto } from '../../application/responses/due-flashcard.response.dto';
import { FolderTopicResponseDto } from '../../application/responses/folder-topic.response.dto';
import {
  FolderDetailResponseDto,
  FolderFlashcardsResponseDto,
  FolderResponseDto,
} from '../../application/responses/folder.response.dto';
import {
  FrequentlyMissedWordDto,
  MemoryStageDto,
  VocabularyOverviewResponseDto,
} from '../../application/responses/vocabulary-overview.response.dto';
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
      .leftJoin(
        'vocab_user_progress',
        'progress',
        'progress."flashcardId" = flashcard.id AND progress."userId" = :userId',
        { userId: validUserId },
      )
      .select([
        'folder.id AS id',
        'folder.name AS name',
        'folder.description AS description',
        'folder.category AS category',
        'folder.authorId AS "authorId"',
        'COUNT(DISTINCT flashcard.id)::int AS "flashcardCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND (progress.level > 0 OR progress."learningStep" > 0 OR progress."masteryScore" > 0) THEN flashcard.id END)::int AS "learnedCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND progress."nextReviewAt" <= :now THEN flashcard.id END)::int AS "dueCount"',
      ])
      .setParameter('now', new Date());

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
      authorId: string;
      flashcardCount: number | string;
      learnedCount: number | string;
      dueCount: number | string;
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
      isSystem: row.category !== null && row.authorId !== validUserId,
      flashcardCount:
        typeof row.flashcardCount === 'number'
          ? row.flashcardCount
          : parseInt(row.flashcardCount || '0', 10),
      learnedCount:
        typeof row.learnedCount === 'number'
          ? row.learnedCount
          : parseInt(String(row.learnedCount || '0'), 10),
      dueCount:
        typeof row.dueCount === 'number'
          ? row.dueCount
          : parseInt(String(row.dueCount || '0'), 10),
    }));
  }

  async findFolderByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<FolderDetailResponseDto | null> {
    if (!id || id === 'undefined') return null;

    const validUserId = userId && userId !== 'undefined' ? userId : null;

    interface RawFolderRow {
      id: string;
      name: string;
      description: string | null;
      category: string | null;
      authorId: string;
      flashcardCount: number | string;
      learnedCount: number | string;
      dueCount: number | string;
    }

    const qb = this.folderRepo
      .createQueryBuilder('folder')
      .leftJoin('folder.flashcards', 'flashcard')
      .leftJoin(
        'vocab_user_progress',
        'progress',
        'progress."flashcardId" = flashcard.id AND progress."userId" = :userId',
        { userId: validUserId },
      )
      .select([
        'folder.id AS id',
        'folder.name AS name',
        'folder.description AS description',
        'folder.category AS category',
        'folder.authorId AS "authorId"',
        'COUNT(DISTINCT flashcard.id)::int AS "flashcardCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND (progress.level > 0 OR progress."learningStep" > 0 OR progress."masteryScore" > 0) THEN flashcard.id END)::int AS "learnedCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND progress."nextReviewAt" <= :now THEN flashcard.id END)::int AS "dueCount"',
      ])
      .setParameter('now', new Date())
      .groupBy('folder.id')
      .addGroupBy('folder.name')
      .addGroupBy('folder.description')
      .addGroupBy('folder.category')
      .addGroupBy('folder.authorId');

    if (validUserId) {
      qb.where(
        'folder.id = :id AND (folder.authorId = :userId OR folder.category IS NOT NULL)',
        { id, userId: validUserId },
      );
    } else {
      qb.where('folder.id = :id AND folder.category IS NOT NULL', { id });
    }

    const row = await qb.getRawOne<RawFolderRow>();
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category || null,
      isSystem: row.category !== null && row.authorId !== validUserId,
      flashcardCount:
        typeof row.flashcardCount === 'number'
          ? row.flashcardCount
          : parseInt(String(row.flashcardCount || '0'), 10),
      learnedCount:
        typeof row.learnedCount === 'number'
          ? row.learnedCount
          : parseInt(String(row.learnedCount || '0'), 10),
      dueCount:
        typeof row.dueCount === 'number'
          ? row.dueCount
          : parseInt(String(row.dueCount || '0'), 10),
    };
  }

  async findFolderTopics(
    folderId: string,
    userId: string,
  ): Promise<FolderTopicResponseDto[]> {
    if (!folderId || folderId === 'undefined') return [];
    const validUserId = userId && userId !== 'undefined' ? userId : null;

    interface RawTopicRow {
      topic: string;
      topicVi: string | null;
      topicImageUrl: string | null;
      count: number | string;
      learnedCount: number | string;
      dueCount: number | string;
    }

    const qb = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .innerJoin('flashcard.folder', 'folder')
      .innerJoin('flashcard.word', 'word')
      .leftJoin(
        'vocab_user_progress',
        'progress',
        'progress."flashcardId" = flashcard.id AND progress."userId" = :userId',
        { userId: validUserId },
      )
      .select([
        "COALESCE(word.topic, 'General') AS topic",
        'word."topicVi" AS "topicVi"',
        'word."topicImageUrl" AS "topicImageUrl"',
        'COUNT(DISTINCT flashcard.id)::int AS count',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND (progress.level > 0 OR progress."learningStep" > 0 OR progress."masteryScore" > 0) THEN flashcard.id END)::int AS "learnedCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND progress."nextReviewAt" <= :now THEN flashcard.id END)::int AS "dueCount"',
      ])
      .setParameter('now', new Date())
      .where('flashcard."folderId" = :folderId', { folderId })
      .groupBy('word.topic')
      .addGroupBy('word."topicVi"')
      .addGroupBy('word."topicImageUrl"')
      .orderBy('word.topic', 'ASC');

    const rows = await qb.getRawMany<RawTopicRow>();

    return rows.map((row) => ({
      topic: row.topic,
      topicVi: row.topicVi || null,
      topicImageUrl: row.topicImageUrl || null,
      count:
        typeof row.count === 'number'
          ? row.count
          : parseInt(String(row.count || '0'), 10),
      learnedCount:
        typeof row.learnedCount === 'number'
          ? row.learnedCount
          : parseInt(String(row.learnedCount || '0'), 10),
      dueCount:
        typeof row.dueCount === 'number'
          ? row.dueCount
          : parseInt(String(row.dueCount || '0'), 10),
    }));
  }

  async findFlashcardsByFolderAndTopic(
    folderId: string,
    userId: string,
    topic?: string,
    page = 1,
    limit = 50,
  ): Promise<FolderFlashcardsResponseDto> {
    if (!folderId || folderId === 'undefined') return { data: [], total: 0 };
    const validUserId = userId && userId !== 'undefined' ? userId : null;
    const offset = (page - 1) * limit;

    const qb = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .innerJoinAndSelect('flashcard.word', 'word')
      .innerJoinAndSelect('word.definitions', 'definition')
      .leftJoinAndSelect('definition.examples', 'example')
      .where('flashcard."folderId" = :folderId', { folderId });

    if (topic) {
      qb.andWhere("COALESCE(word.topic, 'General') = :topic", { topic });
    }

    if (validUserId) {
      qb.leftJoinAndSelect(
        'flashcard.progresses',
        'progress',
        'progress.userId = :userId',
        { userId: validUserId },
      );
    }

    const total = await qb.getCount();
    const flashcards = await qb.skip(offset).take(limit).getMany();

    return {
      data: flashcards.map((flashcard) => ({
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
        level: flashcard.progresses?.[0]?.level ?? 0,
        learningStep: flashcard.progresses?.[0]?.learningStep ?? 0,
        masteryScore: flashcard.progresses?.[0]?.masteryScore ?? 0,
        isWilted: flashcard.progresses?.[0]?.isWilted ?? false,
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
      total,
    };
  }

  async findDueFlashcards(
    userId: string,
    folderId?: string,
    limit?: number,
    includeNew = false,
  ): Promise<DueFlashcardResponseDto[]> {
    const validUserId = userId && userId !== 'undefined' ? userId : null;
    const validFolderId =
      folderId && folderId !== 'undefined' ? folderId : null;

    if (!validUserId) return [];

    const queryBuilder = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .leftJoin('flashcard.word', 'word')
      .leftJoin('flashcard.folder', 'folder')
      .leftJoin(
        'vocab_user_progress',
        'progress',
        'progress."flashcardId" = flashcard.id AND progress."userId" = :userId',
        { userId: validUserId },
      )
      .select([
        'flashcard.id AS flashcard_id',
        'word.id AS word_id',
        'word.term AS word_term',
        'folder.id AS folder_id',
        'folder.name AS folder_name',
        'progress.masteryScore AS "progress_masteryScore"',
        'progress.level AS progress_level',
        'progress.isWilted AS "progress_isWilted"',
        'progress.learningStep AS "progress_learningStep"',
        'progress.reviewCountAtCurrentLevel AS "progress_reviewCountAtCurrentLevel"',
        'progress.intervalDays AS "progress_intervalDays"',
        'progress.nextReviewAt AS "progress_nextReviewAt"',
      ]);

    if (validFolderId) {
      queryBuilder.andWhere('folder.id = :folderId', {
        folderId: validFolderId,
      });
    }

    if (includeNew) {
      queryBuilder.andWhere(
        '(progress.id IS NULL OR progress."nextReviewAt" <= :now)',
        { now: new Date() },
      );
      queryBuilder
        .orderBy('progress.id', 'ASC', 'NULLS FIRST')
        .addOrderBy('progress."nextReviewAt"', 'ASC', 'NULLS FIRST');
    } else {
      queryBuilder.andWhere(
        'progress.id IS NOT NULL AND progress."nextReviewAt" <= :now',
        { now: new Date() },
      );
      queryBuilder.orderBy('progress."nextReviewAt"', 'ASC');
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    interface DueFlashcardRawRow {
      flashcard_id: string;
      word_id: string;
      word_term: string;
      folder_id: string;
      folder_name: string;
      progress_masteryScore: number | null;
      progress_level: number | null;
      progress_isWilted: boolean | null;
      progress_learningStep: number | null;
      progress_reviewCountAtCurrentLevel: number | null;
      progress_intervalDays: number | null;
      progress_nextReviewAt: Date | null;
    }

    const rawResults = await queryBuilder.getRawMany<DueFlashcardRawRow>();

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

  async getOverview(userId: string): Promise<VocabularyOverviewResponseDto> {
    const validUserId = userId && userId !== 'undefined' ? userId : null;
    if (!validUserId) {
      return new VocabularyOverviewResponseDto(
        0,
        0,
        [
          new MemoryStageDto(1, 0),
          new MemoryStageDto(2, 0),
          new MemoryStageDto(3, 0),
          new MemoryStageDto(4, 0),
          new MemoryStageDto(5, 0),
        ],
        [],
      );
    }

    const stagesRaw = await this.progressRepo
      .createQueryBuilder('progress')
      .select('progress.level', 'level')
      .addSelect('progress.learningStep', 'learningStep')
      .addSelect('COUNT(DISTINCT progress.flashcardId)::int', 'count')
      .where('progress.userId = :userId', { userId: validUserId })
      .groupBy('progress.level')
      .addGroupBy('progress.learningStep')
      .getRawMany<{
        level: number | string;
        learningStep: number | string;
        count: number | string;
      }>();

    const stageCounts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let totalLearnedWords = 0;

    stagesRaw.forEach((row) => {
      const lvl = Number(row.level);
      const step = Number(row.learningStep);
      const count =
        typeof row.count === 'number'
          ? row.count
          : parseInt(String(row.count || '0'), 10);

      if (lvl === 0 && step > 0) {
        stageCounts[1] = (stageCounts[1] || 0) + count;
        totalLearnedWords += count;
      } else if (lvl >= 1 && lvl <= 4) {
        stageCounts[lvl] = (stageCounts[lvl] || 0) + count;
        totalLearnedWords += count;
      } else if (lvl >= 5) {
        stageCounts[5] = (stageCounts[5] || 0) + count;
        totalLearnedWords += count;
      }
    });

    const memoryLevels = [
      new MemoryStageDto(1, stageCounts[1] || 0),
      new MemoryStageDto(2, stageCounts[2] || 0),
      new MemoryStageDto(3, stageCounts[3] || 0),
      new MemoryStageDto(4, stageCounts[4] || 0),
      new MemoryStageDto(5, stageCounts[5] || 0),
    ];

    const missedRaw = await this.progressRepo
      .createQueryBuilder('progress')
      .innerJoin('progress.flashcard', 'flashcard')
      .innerJoin('flashcard.word', 'word')
      .leftJoin('word.definitions', 'definition')
      .where('progress.userId = :userId', { userId: validUserId })
      .andWhere('(progress.isWilted = true OR progress.masteryScore < 60)')
      .select([
        'flashcard.id AS flashcard_id',
        'word.id AS word_id',
        'word.term AS word_term',
        'word.phonetic AS word_phonetic',
        'word.audioUrl AS word_audio_url',
        'word.audioUsUrl AS word_audio_us_url',
        'word.imageUrl AS word_image_url',
        'progress.masteryScore AS progress_mastery_score',
        'progress.isWilted AS progress_is_wilted',
        'definition.partOfSpeech AS def_part_of_speech',
        'definition.definition AS def_definition',
      ])
      .orderBy('progress.isWilted', 'DESC')
      .addOrderBy('progress.masteryScore', 'ASC')
      .addOrderBy('progress.lastReviewedAt', 'DESC')
      .limit(10)
      .getRawMany<{
        flashcard_id: string;
        word_id: string;
        word_term: string;
        word_phonetic: string | null;
        word_audio_url: string | null;
        word_audio_us_url: string | null;
        word_image_url: string | null;
        progress_mastery_score: number | null;
        progress_is_wilted: boolean | null;
        def_part_of_speech: string | null;
        def_definition: unknown;
      }>();

    const seenTerms = new Set<string>();
    const frequentlyMissedWords: FrequentlyMissedWordDto[] = [];

    for (const row of missedRaw) {
      const termLower = (row.word_term || '').toLowerCase().trim();
      if (!termLower || seenTerms.has(termLower)) continue;
      seenTerms.add(termLower);

      let definitionText: string | null = null;
      if (typeof row.def_definition === 'string') {
        definitionText = row.def_definition;
      } else if (
        typeof row.def_definition === 'object' &&
        row.def_definition !== null
      ) {
        const defObj = row.def_definition as Record<string, string>;
        definitionText =
          defObj.vi || defObj.en || Object.values(defObj)[0] || null;
      }

      const mastery = Number(row.progress_mastery_score ?? 0);
      const errorRate = Math.min(95, Math.max(15, Math.round(100 - mastery)));

      frequentlyMissedWords.push(
        new FrequentlyMissedWordDto({
          flashcardId: row.flashcard_id,
          wordId: row.word_id,
          term: row.word_term,
          partOfSpeech: row.def_part_of_speech || null,
          definition: definitionText,
          phonetic: row.word_phonetic || null,
          audioUrl: row.word_audio_url || null,
          audioUsUrl: row.word_audio_us_url || null,
          imageUrl: row.word_image_url || null,
          errorRate,
          masteryScore: mastery,
          isWilted: Boolean(row.progress_is_wilted),
        }),
      );

      if (frequentlyMissedWords.length >= 3) break;
    }

    const dueCountRaw = await this.progressRepo
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId: validUserId })
      .andWhere('progress.nextReviewAt <= :now', { now: new Date() })
      .getCount();

    return new VocabularyOverviewResponseDto(
      totalLearnedWords,
      dueCountRaw,
      memoryLevels,
      frequentlyMissedWords,
    );
  }
}
