import { IsUUID, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewFlashcardDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  flashcardId: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user answered correctly',
  })
  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the user marked the word as Known (Fast-track to level 5)',
  })
  @IsOptional()
  @IsBoolean()
  isFastTrackKnown?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the user marked the word as Temp Memory (Fast-track to level 2)',
  })
  @IsOptional()
  @IsBoolean()
  isFastTrackTempMemory?: boolean;
}
