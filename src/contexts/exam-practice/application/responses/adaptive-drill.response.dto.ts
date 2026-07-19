import { Expose, Type } from 'class-transformer';

export class AdaptiveDrillQuestionDto {
  @Expose()
  questionId: string;

  @Expose()
  partNumber: number;

  @Expose()
  prompt: string;

  @Expose()
  options: string[];

  @Expose()
  explanation?: string;

  constructor(
    questionId: string,
    partNumber: number,
    prompt: string,
    options: string[],
    explanation?: string,
  ) {
    this.questionId = questionId;
    this.partNumber = partNumber;
    this.prompt = prompt;
    this.options = options;
    this.explanation = explanation;
  }
}

export class AdaptiveDrillResponseDto {
  @Expose()
  drillId: string;

  @Expose()
  title: string;

  @Expose()
  targetPartNumbers: number[];

  @Expose()
  estimatedMinutes: number;

  @Expose()
  @Type(() => AdaptiveDrillQuestionDto)
  questions: AdaptiveDrillQuestionDto[];

  constructor(
    drillId: string,
    title: string,
    targetPartNumbers: number[],
    estimatedMinutes: number,
    questions: AdaptiveDrillQuestionDto[],
  ) {
    this.drillId = drillId;
    this.title = title;
    this.targetPartNumbers = targetPartNumbers;
    this.estimatedMinutes = estimatedMinutes;
    this.questions = questions;
  }
}
