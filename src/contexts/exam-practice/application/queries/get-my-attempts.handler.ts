import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AttemptSummaryResponseDto } from '../responses/attempt-summary.response.dto';
import {
  PagedData,
  PagingMeta,
} from '../../../../shared-kernel/response/paging';

export class GetMyAttemptsQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

@QueryHandler(GetMyAttemptsQuery)
export class GetMyAttemptsHandler implements IQueryHandler<
  GetMyAttemptsQuery,
  PagedData<AttemptSummaryResponseDto>
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(
    query: GetMyAttemptsQuery,
  ): Promise<PagedData<AttemptSummaryResponseDto>> {
    const { items, total } = await this.attemptRepo.findByUserIdPaged(
      query.userId,
      query.page,
      query.limit,
    );

    const dtos = items.map((attempt) => {
      const totalAnswered = attempt.answers.length;
      const totalCorrect = attempt.answers.filter(
        (answer) => answer.isCorrect === true,
      ).length;

      return new AttemptSummaryResponseDto({
        id: attempt.id,
        testId: attempt.testId,
        testType: attempt.testType,
        status: attempt.status,
        mode: attempt.mode,
        listeningScore: attempt.listeningScore,
        readingScore: attempt.readingScore,
        totalScore: attempt.totalScore,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalAnswered,
        totalCorrect,
      });
    });

    return new PagedData(dtos, new PagingMeta(query.page, query.limit, total));
  }
}
