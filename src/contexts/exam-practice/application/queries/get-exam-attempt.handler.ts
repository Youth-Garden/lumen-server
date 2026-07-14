import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import {
  ExamAttemptResponseDto,
  ExamAnswerResponseDto,
} from '../responses/exam-attempt.response.dto';
import { AppException } from '../../../../common/exceptions/app.exception';
import { ExamPracticeEx } from '../../domain/exceptions/exam-practice.exception';

export class GetExamAttemptQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly attemptId: string,
  ) {}
}

@QueryHandler(GetExamAttemptQuery)
export class GetExamAttemptHandler implements IQueryHandler<
  GetExamAttemptQuery,
  ExamAttemptResponseDto
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(query: GetExamAttemptQuery): Promise<ExamAttemptResponseDto> {
    const attempt = await this.attemptRepo.findById(query.attemptId);

    if (!attempt || attempt.userId !== query.userId) {
      throw new AppException(ExamPracticeEx.AttemptNotFound);
    }

    const answersDto = attempt.answers.map(
      (a) =>
        new ExamAnswerResponseDto({
          questionId: a.questionId,
          userAnswer: a.userAnswer,
          isCorrect: a.isCorrect,
        }),
    );

    return new ExamAttemptResponseDto({
      id: attempt.id,
      userId: attempt.userId,
      testId: attempt.testId,
      testType: attempt.testType,
      status: attempt.status,
      listeningScore: attempt.listeningScore,
      readingScore: attempt.readingScore,
      totalScore: attempt.totalScore,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      mode: attempt.mode,
      elapsedSeconds: attempt.elapsedSeconds,
      questionIds: attempt.questionIds,
      answers: answersDto,
    });
  }
}
