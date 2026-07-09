import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GrammarExerciseResponseDto {
  @Expose()
  id: string;

  @Expose()
  lessonId: string;

  @Expose()
  questionText: string;

  @Expose()
  options: string[];

  // Note: correctAnswer and explanation are intentionally omitted
  // to avoid leaking the answer to the client before they submit it.

  constructor(partial: Partial<GrammarExerciseResponseDto>) {
    Object.assign(this, partial);
  }
}
