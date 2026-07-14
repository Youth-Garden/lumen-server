import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ExamAttemptStatus,
  ExamAttemptMode,
  ExamType,
} from '../../domain/enums/exam.enum';

export class AttemptSummaryResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

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
  @ApiProperty({ enum: ExamAttemptMode })
  mode: ExamAttemptMode;

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
  @ApiProperty()
  totalAnswered: number;

  @Expose()
  @ApiProperty()
  totalCorrect: number;

  constructor(partial: Partial<AttemptSummaryResponseDto>) {
    Object.assign(this, partial);
  }
}
