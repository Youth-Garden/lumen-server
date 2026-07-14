import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ToeicQuestionTopic } from '../../../domain/enums/toeic-question-topic.enum';

export class UpdateToeicQuestionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  part: number;

  @IsNumber()
  questionNumber: number;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  @IsString()
  @IsOptional()
  questionText?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsString()
  correctAnswer: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  translation?: string;

  @IsEnum(ToeicQuestionTopic)
  @IsOptional()
  topic?: ToeicQuestionTopic;
}

export class UpdateToeicTestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateToeicQuestionDto)
  @IsOptional()
  questions?: UpdateToeicQuestionDto[];
}
