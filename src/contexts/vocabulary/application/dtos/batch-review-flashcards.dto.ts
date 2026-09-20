import {
  IsUUID,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewFlashcardItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  flashcardId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user answered correctly',
  })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiPropertyOptional({
    example: false,
    description:
      'Whether the user marked the word as Known (Fast-track to level 5)',
  })
  @IsOptional()
  @IsBoolean()
  isFastTrackKnown?: boolean;

  @ApiPropertyOptional({
    example: false,
    description:
      'Whether the user marked the word as Temp Memory (Fast-track to level 2)',
  })
  @IsOptional()
  @IsBoolean()
  isFastTrackTempMemory?: boolean;

  @ApiPropertyOptional({
    example: false,
    description:
      'Whether to reset the word progress completely to unlearned (Level 0, Step 0)',
  })
  @IsOptional()
  @IsBoolean()
  isResetToUnlearned?: boolean;
}

export class BatchReviewFlashcardsDto {
  @ApiProperty({
    type: [ReviewFlashcardItemDto],
    description: 'List of flashcard reviews to record in batch',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReviewFlashcardItemDto)
  reviews: ReviewFlashcardItemDto[];
}
