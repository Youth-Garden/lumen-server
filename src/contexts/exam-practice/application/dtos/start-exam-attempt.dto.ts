import { IsEnum, IsUUID } from 'class-validator';
import { ExamType } from '../../domain/enums/exam.enum';
import { ApiProperty } from '@nestjs/swagger';

export class StartExamAttemptDto {
  @ApiProperty({ description: 'ID of the test to start (e.g. TOEIC test ID)' })
  @IsUUID()
  testId: string;

  @ApiProperty({ enum: ExamType })
  @IsEnum(ExamType)
  testType: ExamType;
}
