import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AppException } from '../../../../common/exceptions';
import { QuizEx } from '../../domain/exceptions/quiz.exception';
import { plainToInstance } from 'class-transformer';
import { GetQuizByIdQuery } from './get-quiz-by-id.query';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { QuizStatus } from '../../domain/enums/quiz.enum';
import { QuizDetailResponseDto } from '../responses/quiz.response.dto';

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
