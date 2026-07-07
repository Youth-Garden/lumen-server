import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AppException, QuizEx } from '../../../../shared-kernel/exceptions';
import { plainToInstance } from 'class-transformer';
import { GetQuizByIdQuery } from './get-quiz-by-id.query';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { ApiProperty } from '@nestjs/swagger';
import { QuizStatus } from '../../domain/enums/quiz.enum';

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

@QueryHandler(GetQuizByIdQuery)
export class GetQuizByIdHandler implements IQueryHandler<
  GetQuizByIdQuery,
  QuizDetailResponseDto
> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(query: GetQuizByIdQuery): Promise<QuizDetailResponseDto> {
    const quiz = await this.quizRepository.findByIdAndUserId(
      query.id,
      query.userId,
    );

    if (!quiz) {
      throw new AppException(QuizEx.NotFound());
    }

    const isCompleted = quiz.status === QuizStatus.COMPLETED;

    const plainResponse = {
      id: quiz.id,
      status: quiz.status,
      score: quiz.score,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        questionText: q.questionText,
        options: q.options || undefined,
        userAnswer: q.userAnswer || undefined,
        correctAnswer: isCompleted ? q.correctAnswer || undefined : undefined,
        isCorrect: isCompleted
          ? q.isCorrect !== null
            ? q.isCorrect
            : undefined
          : undefined,
      })),
      createdAt: quiz.createdAt,
      completedAt: quiz.completedAt || undefined,
    };

    return plainToInstance(QuizDetailResponseDto, plainResponse);
  }
}
