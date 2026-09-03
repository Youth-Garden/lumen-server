import { ApiProperty } from '@nestjs/swagger';

export class DeckResponseDto {
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

  @ApiProperty({ nullable: true })
  phonetic: string | null;

  @ApiProperty({ nullable: true })
  audioUrl: string | null;

  @ApiProperty({ nullable: true })
  cefrLevel: string | null;

  @ApiProperty({ nullable: true, required: false })
  imageUrl?: string | null;

  @ApiProperty({ type: [FlashcardDefinitionDto], required: false })
  definitions?: FlashcardDefinitionDto[];
}

export class DeckDetailResponseDto {
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
