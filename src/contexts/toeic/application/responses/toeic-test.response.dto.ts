import { ApiProperty } from '@nestjs/swagger';
import { ToeicQuestionTopic } from '../../domain/enums/toeic-question-topic.enum';

export class ToeicQuestionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  part: number;

  @ApiProperty()
  questionNumber: number;

  @ApiProperty({ nullable: true })
  audioUrl: string | null;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ nullable: true })
  transcript: string | null;

  @ApiProperty({ nullable: true })
  questionText: string | null;

  @ApiProperty({ type: [String], nullable: true })
  options?: string[];

  @ApiProperty({ nullable: true })
  materialId?: string;

  @ApiProperty({ nullable: true })
  correctAnswer: string;

  @ApiProperty({ nullable: true })
  explanation: string | null;

  @ApiProperty({ nullable: true })
  translation: string | null;

  @ApiProperty({ enum: ToeicQuestionTopic, nullable: true })
  topic: ToeicQuestionTopic | null;
}

export class ToeicTestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => [ToeicQuestionResponseDto], required: false })
  questions?: ToeicQuestionResponseDto[];
}
