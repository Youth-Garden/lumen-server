import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ExamAttemptMode,
  ExamAttemptStatus,
  ExamType,
} from '../../domain/enums/exam.enum';

export class ExamAnswerResponseDto {
  @Expose()
  @ApiProperty()
  questionId: string;

  @Expose()
  @ApiProperty()
  userAnswer: string;

  @Expose()
  @ApiProperty({ nullable: true })
  isCorrect: boolean | null;

  constructor(partial: Partial<ExamAnswerResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ExamAttemptResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  testId: string;

  @Expose()
  @ApiProperty({ enum: ExamType })
  testType: ExamType;

  @Expose()
  @ApiProperty({ enum: ExamAttemptStatus })
  status: ExamAttemptStatus;

  @Expose()
  @ApiProperty()
  listeningScore: number;

  @Expose()
  @ApiProperty()
  readingScore: number;

  @Expose()
  @ApiProperty()
  totalScore: number;

  @Expose()
  @ApiProperty()
  startedAt: Date;

  @Expose()
  @ApiProperty({ nullable: true })
  completedAt: Date | null;

  @Expose()
  @ApiProperty({ enum: ExamAttemptMode })
  mode: ExamAttemptMode;

  @Expose()
  @ApiProperty({ type: [String], nullable: true })
  questionIds: string[] | null;

  @Expose()
  @Type(() => ExamAnswerResponseDto)
  @ApiProperty({ type: [ExamAnswerResponseDto] })
  answers: ExamAnswerResponseDto[];

  constructor(partial: Partial<ExamAttemptResponseDto>) {
    Object.assign(this, partial);
  }
}
