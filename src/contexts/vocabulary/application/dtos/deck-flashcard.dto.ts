import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeckDto {
  @ApiProperty({ example: 'My English Deck' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'A deck to learn English vocabulary.' })
  @IsString()
  @IsOptional()
  description: string | null;
}

export class CreateFlashcardDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  deckId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsNotEmpty()
  wordId: string;
}
