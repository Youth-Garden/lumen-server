import { IsInt, Min, Max, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewFlashcardDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  flashcardId: string;

  @ApiProperty({
    example: 4,
    description: 'Grade from 0 to 5 based on SM-2 algorithm',
  })
  @IsInt()
  @Min(0)
  @Max(5)
  grade: number;
}
