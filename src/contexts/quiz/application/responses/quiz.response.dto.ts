import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

export class QuizListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;
}

import { PaginatedResponseDto } from '../../../../shared/presentation/dtos/paginated-response.dto';

export class QuizListResponseDto extends PaginatedResponseDto<QuizListItemDto> {}

export class QuestionDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  questionText: string;

  @ApiProperty({ type: [String], required: false })
  options?: string[];

  @ApiProperty({ required: false })
  userAnswer?: string;

  @ApiProperty({ required: false })
  correctAnswer?: string;

  @ApiProperty({ required: false })
  isCorrect?: boolean;
}

export class QuizDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ type: [QuestionDetailDto] })
  questions: QuestionDetailDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;
}
