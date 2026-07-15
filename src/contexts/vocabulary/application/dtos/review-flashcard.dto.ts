import { IsInt, Min, Max, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewFlashcardDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  flashcardId: string;

  @ApiProperty({
    example: 3,
    description:
      'Quality from 1 to 4 based on FSRS algorithm (1=Again, 2=Hard, 3=Good, 4=Easy)',
  })
  @IsInt()
  @Min(1)
  @Max(4)
  quality: number;
}
