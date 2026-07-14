import { IsEnum, IsUUID, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ExamType, ExamAttemptMode } from '../../domain/enums/exam.enum';
import { ApiProperty } from '@nestjs/swagger';

export class StartExamAttemptDto {
  @ApiProperty({ description: 'ID of the test to start (e.g. TOEIC test ID)' })
  @IsUUID()
  testId: string;

  @ApiProperty({ enum: ExamType })
  @IsEnum(ExamType)
  testType: ExamType;

  @ApiProperty({ enum: ExamAttemptMode, required: false })
  @IsEnum(ExamAttemptMode)
  @IsOptional()
  mode?: ExamAttemptMode;

  @ApiProperty({ type: [Number], required: false })
  @IsArray()
  @IsOptional()
  partsAttempted?: number[];

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  customTimeLimit?: number;
}

