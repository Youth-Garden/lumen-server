import { IsString, IsUUID, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitExamAnswerDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsString()
  userAnswer: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  timeSpent?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  flaggedHard?: boolean;
}

