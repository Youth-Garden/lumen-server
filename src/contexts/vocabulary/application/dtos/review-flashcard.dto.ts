import { IsInt, Min, Max, IsUUID, IsNotEmpty } from 'class-validator';

export class ReviewFlashcardDto {
  @IsUUID()
  @IsNotEmpty()
  flashcardId: string;

  @IsInt()
  @Min(0)
  @Max(5)
  grade: number;
}
