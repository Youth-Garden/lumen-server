import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import type { IVocabularyQueryRepository } from '../../application/ports/vocabulary-query.repository';
import { DueWordResponseDto } from '../../application/responses/due-word.response.dto';
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
import { TopicEntity } from '../entities/topic.entity';
import { UserProgressEntity } from '../entities/user-progress.entity';

import type { I18nString } from '../../../../shared/domain/types/translation.type';
import { toI18nString } from '../../../../shared/utils';

function parseI18nValue(value: unknown): I18nString {
  return toI18nString(value);
}

function parseI18nNullableValue(value: unknown): I18nString | null {
  if (value === null || value === undefined) return null;
  const res = toI18nString(value);
  return Object.keys(res).length > 0 ? res : null;
}

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
    @InjectRepository(TopicEntity)
    private readonly topicRepo: Repository<TopicEntity>,
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
        'folder.imageUrl AS "imageUrl"',
        'folder.isSystem AS "isSystem"',
        'folder.authorId AS "authorId"',
        'COUNT(DISTINCT flashcard.id)::int AS "flashcardCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND (progress.level >= 1 OR progress."learningStep" >= 5) THEN flashcard.id END)::int AS "learnedCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND progress."nextReviewAt" <= :now THEN flashcard.id END)::int AS "dueCount"',
      ])
      .setParameter('now', new Date());

    if (validUserId) {
      queryBuilder.where(
        'folder.authorId = :userId OR folder.category IS NOT NULL OR folder.isSystem = true',
        { userId: validUserId },
      );
    } else {
      queryBuilder.where(
        'folder.category IS NOT NULL OR folder.isSystem = true',
      );
    }

    interface RawFolderRow {
      id: string;
      name: unknown;
      description: unknown;
      category: unknown;
      imageUrl: string | null;
      isSystem: boolean | null;
      authorId: string;
      flashcardCount: number | string;
      learnedCount: number | string;
      dueCount: number | string;
    }

    const rawResults = await queryBuilder
      .groupBy('folder.id')
      .addGroupBy('folder.name::text')
      .addGroupBy('folder.description::text')
      .addGroupBy('folder.category::text')
      .addGroupBy('folder.imageUrl')
      .addGroupBy('folder.isSystem')
      .addGroupBy('folder.authorId')
      .addGroupBy('folder.createdAt')
      .orderBy('folder.createdAt', 'ASC')
      .getRawMany<RawFolderRow>();

    return rawResults.map((row) => ({
      id: row.id,
      name: parseI18nValue(row.name),
      description: parseI18nNullableValue(row.description),
      category: parseI18nNullableValue(row.category),
      imageUrl: row.imageUrl ?? null,
      isSystem:
        Boolean(row.isSystem) ||
        (row.category !== null && row.authorId !== validUserId),
      wordCount:
        typeof row.flashcardCount === 'number'
          ? row.flashcardCount
          : parseInt(String(row.flashcardCount || '0'), 10),
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
      name: unknown;
      description: unknown;
      category: unknown;
      imageUrl: string | null;
      isSystem: boolean | null;
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
        'folder.imageUrl AS "imageUrl"',
        'folder.isSystem AS "isSystem"',
        'folder.authorId AS "authorId"',
        'COUNT(DISTINCT flashcard.id)::int AS "flashcardCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND (progress.level >= 1 OR progress."learningStep" >= 5) THEN flashcard.id END)::int AS "learnedCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND progress."nextReviewAt" <= :now THEN flashcard.id END)::int AS "dueCount"',
      ])
      .setParameter('now', new Date())
      .groupBy('folder.id')
      .addGroupBy('folder.name::text')
      .addGroupBy('folder.description::text')
      .addGroupBy('folder.category::text')
      .addGroupBy('folder.imageUrl')
      .addGroupBy('folder.isSystem')
      .addGroupBy('folder.authorId');

    if (validUserId) {
      qb.where(
        'folder.id = :id AND (folder.authorId = :userId OR folder.category IS NOT NULL OR folder.isSystem = true)',
        { id, userId: validUserId },
      );
    } else {
      qb.where(
        'folder.id = :id AND (folder.category IS NOT NULL OR folder.isSystem = true)',
        { id },
      );
    }

    const row = await qb.getRawOne<RawFolderRow>();
    if (!row) return null;

    return {
      id: row.id,
      name: parseI18nValue(row.name),
      description: parseI18nNullableValue(row.description),
      category: parseI18nNullableValue(row.category),
      imageUrl: row.imageUrl ?? null,
      isSystem:
        Boolean(row.isSystem) ||
        (row.category !== null && row.authorId !== validUserId),
      wordCount:
        typeof row.flashcardCount === 'number'
          ? row.flashcardCount
          : parseInt(String(row.flashcardCount || '0'), 10),
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
      id: string;
      name: unknown;
      imageUrl: string | null;
      orderIndex: number | string;
      count: number | string;
      learnedCount: number | string;
      dueCount: number | string;
    }

    const qb = this.topicRepo
      .createQueryBuilder('topic')
      .leftJoin('topic.flashcards', 'flashcard')
      .leftJoin(
        'vocab_user_progress',
        'progress',
        'progress."flashcardId" = flashcard.id AND progress."userId" = :userId',
        { userId: validUserId },
      )
      .select([
        'topic.id AS id',
        'topic.name AS name',
        'topic.imageUrl AS "imageUrl"',
        'topic.orderIndex AS "orderIndex"',
        'COUNT(DISTINCT flashcard.id)::int AS count',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND (progress.level >= 1 OR progress."learningStep" >= 5) THEN flashcard.id END)::int AS "learnedCount"',
        'COUNT(DISTINCT CASE WHEN progress.id IS NOT NULL AND progress."nextReviewAt" <= :now THEN flashcard.id END)::int AS "dueCount"',
      ])
      .setParameter('now', new Date())
      .where('topic."folderId" = :folderId', { folderId })
      .groupBy('topic.id')
      .addGroupBy('topic.name::text')
      .addGroupBy('topic.imageUrl')
      .addGroupBy('topic.orderIndex')
      .addGroupBy('topic.created_at')
      .orderBy('topic.orderIndex', 'ASC')
      .addOrderBy('topic.created_at', 'ASC');

    const rows = await qb.getRawMany<RawTopicRow>();

    return rows.map((row) => {
      const parsedName = parseI18nValue(row.name);
      return {
        id: row.id,
        name: parsedName,
        topic: parsedName,
        imageUrl: row.imageUrl ?? null,
        topicImageUrl: row.imageUrl ?? null,
        orderIndex: Number(row.orderIndex ?? 0),
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
      };
    });
  }

  async findAllTopics(
    search?: string,
    page = 1,
    limit = 20,
  ): Promise<FolderTopicResponseDto[]> {
    const qb = this.topicRepo
      .createQueryBuilder('topic')
      .innerJoin('topic.folder', 'folder')
      .leftJoin(
        'vocab_flashcards',
        'flashcard',
        'flashcard."topicId" = topic.id',
      )
      .select([
        'topic.id AS id',
        'topic.name AS name',
        'topic."imageUrl" AS "imageUrl"',
        'topic."orderIndex" AS "orderIndex"',
        'folder.id AS "folderId"',
        'folder.name AS "folderName"',
        'COUNT(flashcard.id)::int AS count',
      ])
      .groupBy('topic.id')
      .addGroupBy('topic.name::text')
      .addGroupBy('topic."imageUrl"')
      .addGroupBy('topic."orderIndex"')
      .addGroupBy('folder.id')
      .addGroupBy('folder.name::text')
      .addGroupBy('topic.created_at')
      .orderBy('topic."orderIndex"', 'ASC')
      .addOrderBy('topic.created_at', 'ASC');

    if (search && search.trim()) {
      qb.where(
        "(topic.name->>'en' ILIKE :search OR topic.name->>'vi' ILIKE :search OR folder.name->>'en' ILIKE :search OR folder.name->>'vi' ILIKE :search)",
        { search: `%${search.trim()}%` },
      );
    }

    const offset = (page - 1) * limit;
    qb.offset(offset).limit(limit);

    interface RawAllTopicRow {
      id: string;
      name: unknown;
      imageUrl: string | null;
      orderIndex: number | string;
      folderId: string;
      folderName: unknown;
      count: number | string;
    }

    const rows = await qb.getRawMany<RawAllTopicRow>();

    return rows.map((row) => {
      const parsedName = parseI18nValue(row.name);
      return {
        id: row.id,
        folderId: row.folderId,
        folderName: parseI18nValue(row.folderName),
        name: parsedName,
        topic: parsedName,
        imageUrl: row.imageUrl ?? null,
        topicImageUrl: row.imageUrl ?? null,
        orderIndex: Number(row.orderIndex ?? 0),
        count:
          typeof row.count === 'number'
            ? row.count
            : parseInt(String(row.count || '0'), 10),
        learnedCount: 0,
        dueCount: 0,
      };
    });
  }

  async findFlashcardsByFolderAndTopic(
    folderId: string,
    userId: string,
    topic: string | undefined,
    page: number,
    limit: number,
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
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          topic,
        );
      if (isUuid) {
        qb.andWhere('flashcard."topicId" = :topicId', { topicId: topic });
      } else {
        qb.leftJoin('flashcard.topicEntity', 'topicEntity');
        qb.andWhere(
          "(flashcard.\"topicId\" IN (SELECT t.id FROM vocab_topics t WHERE t.\"folderId\" = :folderId AND (t.name->>'en' = :topic OR t.name->>'vi' = :topic)) OR flashcard.topic->>'en' = :topic OR flashcard.topic->>'vi' = :topic)",
          { topic, folderId },
        );
      }
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
        topic: flashcard.topic || flashcard.word.topic || null,
        topicImageUrl:
          flashcard.topicImageUrl || flashcard.word.topicImageUrl || null,
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

  async findDueWords(
    userId: string,
    folderId: string | undefined,
    page: number,
    limit: number,
    includeNew?: boolean,
  ): Promise<DueWordResponseDto[]> {
    const validUserId = userId && userId !== 'undefined' ? userId : null;
    const validFolderId =
      folderId && folderId !== 'undefined' ? folderId : null;

    if (!validUserId) return [];

    const offset = (page - 1) * limit;

    const queryBuilder = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .innerJoinAndSelect('flashcard.word', 'word')
      .leftJoinAndSelect('word.definitions', 'definition')
      .innerJoinAndSelect('flashcard.folder', 'folder')
      .leftJoinAndSelect(
        'flashcard.progresses',
        'progress',
        'progress.userId = :userId',
        { userId: validUserId },
      );

    if (validFolderId) {
      queryBuilder.andWhere('folder.id = :folderId', {
        folderId: validFolderId,
      });
    }

    if (includeNew) {
      queryBuilder.andWhere(
        '(progress.id IS NULL OR progress.nextReviewAt <= :now OR progress.isWilted = true)',
        { now: new Date() },
      );
      queryBuilder
        .orderBy('progress.id', 'ASC', 'NULLS FIRST')
        .addOrderBy('progress.nextReviewAt', 'ASC', 'NULLS FIRST');
    } else {
      queryBuilder.andWhere(
        'progress.id IS NOT NULL AND (progress.nextReviewAt <= :now OR progress.isWilted = true)',
        { now: new Date() },
      );
      queryBuilder.orderBy('progress.nextReviewAt', 'ASC');
    }

    queryBuilder.skip(offset).take(limit);

    const flashcards = await queryBuilder.getMany();

    return flashcards.map((fc) => {
      const progress = fc.progresses?.[0];
      return {
        flashcardId: fc.id,
        wordId: fc.word.id,
        term: fc.word.term,
        folderId: fc.folder.id,
        folderName: parseI18nValue(fc.folder.name),
        masteryScore: progress?.masteryScore ?? 0,
        level: progress?.level ?? 0,
        isWilted: progress?.isWilted ?? false,
        learningStep: progress?.learningStep ?? 0,
        reviewCountAtCurrentLevel: progress?.reviewCountAtCurrentLevel ?? 0,
        intervalDays: progress?.intervalDays ?? 0,
        nextReviewAt: progress?.nextReviewAt || null,
        phonetic: fc.word.phonetic,
        phoneticUs: fc.word.phoneticUs,
        phoneticUk: fc.word.phoneticUk,
        audioUrl: fc.word.audioUrl,
        audioUsUrl: fc.word.audioUsUrl,
        audioUkUrl: fc.word.audioUkUrl,
        imageUrl: fc.word.imageUrl,
        definitions: (fc.word.definitions || []).map((def) => ({
          id: def.id,
          partOfSpeech: def.partOfSpeech,
          definition: parseI18nValue(def.definition),
        })),
      };
    });
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

      if (lvl >= 1 && lvl <= 4) {
        stageCounts[lvl] = (stageCounts[lvl] || 0) + count;
        totalLearnedWords += count;
      } else if (lvl >= 5) {
        stageCounts[5] = (stageCounts[5] || 0) + count;
        totalLearnedWords += count;
      } else if (lvl === 0 && step >= 5) {
        stageCounts[1] = (stageCounts[1] || 0) + count;
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

      const mastery = Number(row.progress_mastery_score ?? 0);
      const errorRate = Math.min(95, Math.max(15, Math.round(100 - mastery)));

      frequentlyMissedWords.push(
        new FrequentlyMissedWordDto({
          flashcardId: row.flashcard_id,
          wordId: row.word_id,
          term: row.word_term,
          partOfSpeech: row.def_part_of_speech || null,
          definition: parseI18nNullableValue(row.def_definition),
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
      .andWhere('(progress.nextReviewAt <= :now OR progress.isWilted = true)', {
        now: new Date(),
      })
      .getCount();

    return new VocabularyOverviewResponseDto(
      totalLearnedWords,
      dueCountRaw,
      memoryLevels,
      frequentlyMissedWords,
    );
  }
}
