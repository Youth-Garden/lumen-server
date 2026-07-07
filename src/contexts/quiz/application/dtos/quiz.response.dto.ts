import { Expose } from 'class-transformer';

export class GenerateQuizResponseDto {
  @Expose()
  id: string;

  constructor(partial: Partial<GenerateQuizResponseDto>) {
    Object.assign(this, partial);
  }
}

export class FinishQuizResponseDto {
  @Expose()
  score: number;

  constructor(partial: Partial<FinishQuizResponseDto>) {
    Object.assign(this, partial);
  }
}
