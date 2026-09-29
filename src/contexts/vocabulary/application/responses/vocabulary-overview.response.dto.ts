import { ApiProperty } from '@nestjs/swagger';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class MemoryStageDto {
  @ApiProperty({ example: 1 })
  level: number;

  @ApiProperty({ example: 12 })
  count: number;

  constructor(level: number, count: number) {
    this.level = level;
    this.count = count;
  }
}

export class FrequentlyMissedWordDto {
  @ApiProperty()
  flashcardId: string;

  @ApiProperty()
  wordId: string;

  @ApiProperty()
  term: string;

  @ApiProperty({ nullable: true })
  partOfSpeech: string | null;

  @ApiProperty({ nullable: true })
  definition: I18nString | null;

  @ApiProperty({ nullable: true })
  phonetic: string | null;

  @ApiProperty({ nullable: true })
  audioUrl: string | null;

  @ApiProperty({ nullable: true })
  audioUsUrl: string | null;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ example: 33 })
  errorRate: number;

  @ApiProperty({ example: 25 })
  masteryScore: number;

  @ApiProperty({ example: true })
  isWilted: boolean;

  constructor(partial: Partial<FrequentlyMissedWordDto>) {
    this.flashcardId = partial.flashcardId || '';
    this.wordId = partial.wordId || '';
    this.term = partial.term || '';
    this.partOfSpeech = partial.partOfSpeech ?? null;
    this.definition = partial.definition ?? null;
    this.phonetic = partial.phonetic ?? null;
    this.audioUrl = partial.audioUrl ?? null;
    this.audioUsUrl = partial.audioUsUrl ?? null;
    this.imageUrl = partial.imageUrl ?? null;
    this.errorRate = partial.errorRate ?? 0;
    this.masteryScore = partial.masteryScore ?? 0;
    this.isWilted = partial.isWilted ?? false;
  }
}

export class VocabularyOverviewResponseDto {
  @ApiProperty({ example: 313 })
  totalLearnedWords: number;

  @ApiProperty({ example: 42 })
  dueCount: number;

  @ApiProperty({ type: [MemoryStageDto] })
  memoryLevels: MemoryStageDto[];

  @ApiProperty({ type: [FrequentlyMissedWordDto] })
  frequentlyMissedWords: FrequentlyMissedWordDto[];

  constructor(
    totalLearnedWords: number,
    dueCount: number,
    memoryLevels: MemoryStageDto[],
    frequentlyMissedWords: FrequentlyMissedWordDto[],
  ) {
    this.totalLearnedWords = totalLearnedWords;
    this.dueCount = dueCount;
    this.memoryLevels = memoryLevels;
    this.frequentlyMissedWords = frequentlyMissedWords;
  }
}
