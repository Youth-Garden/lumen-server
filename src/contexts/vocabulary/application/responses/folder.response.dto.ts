import { ApiProperty } from '@nestjs/swagger';

export class FolderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  category: string | null;

  @ApiProperty()
  flashcardCount: number;

  @ApiProperty({ required: false })
  learnedCount?: number;

  @ApiProperty({ required: false })
  dueCount?: number;
}

export class FlashcardDefinitionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  partOfSpeech: string;

  @ApiProperty()
  definition: Record<string, string>;

  @ApiProperty({ required: false })
  examples?: Array<{
    id: string;
    sentence: Record<string, string>;
  }>;
}

export class FlashcardSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  wordId: string;

  @ApiProperty()
  term: string;

  @ApiProperty({ nullable: true, required: false })
  topic?: string | null;

  @ApiProperty({ nullable: true, required: false })
  topicVi?: string | null;

  @ApiProperty({ nullable: true, required: false })
  topicImageUrl?: string | null;

  @ApiProperty({ nullable: true })
  phonetic: string | null;

  @ApiProperty({ nullable: true, required: false })
  phoneticUs?: string | null;

  @ApiProperty({ nullable: true, required: false })
  phoneticUk?: string | null;

  @ApiProperty({ nullable: true })
  audioUrl: string | null;

  @ApiProperty({ nullable: true, required: false })
  audioUsUrl?: string | null;

  @ApiProperty({ nullable: true, required: false })
  audioUkUrl?: string | null;

  @ApiProperty({ nullable: true })
  cefrLevel: string | null;

  @ApiProperty({ nullable: true, required: false })
  imageUrl?: string | null;

  @ApiProperty({ nullable: true, required: false })
  level?: number;

  @ApiProperty({ nullable: true, required: false })
  learningStep?: number;

  @ApiProperty({ nullable: true, required: false })
  masteryScore?: number;

  @ApiProperty({ nullable: true, required: false })
  isWilted?: boolean;

  @ApiProperty({ type: [FlashcardDefinitionDto], required: false })
  definitions?: FlashcardDefinitionDto[];
}

export class FolderDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  category: string | null;

  @ApiProperty({ type: [FlashcardSummaryDto] })
  flashcards: FlashcardSummaryDto[];
}
