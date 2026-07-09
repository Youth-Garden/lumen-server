import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SubmitExerciseResponseDto {
  @Expose()
  isCorrect: boolean;

  @Expose()
  correctAnswer: string;

  @Expose()
  explanation: string;

  constructor(partial: Partial<SubmitExerciseResponseDto>) {
    Object.assign(this, partial);
  }
}
