import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AttemptSummaryResponseDto } from '../responses/attempt-summary.response.dto';
import {
  PagedData,
  PagingMeta,
} from '../../../../shared/presentation/response/paging';

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
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    query: GetMyAttemptsQuery,
  ): Promise<PagedData<AttemptSummaryResponseDto>> {
    const { items, total } = await this.attemptRepo.findByUserIdPaged(
      query.userId,
      query.page,
      query.limit,
    );

    // Batch fetch test titles via raw query to avoid cross-module coupling
    const testIds = [...new Set(items.map((attempt) => attempt.testId))];
    const titleMap = new Map<string, string>();

    if (testIds.length > 0) {
      const rows = await this.dataSource.query<{ id: string; title: string }[]>(
        `SELECT id, title FROM toeic_tests WHERE id = ANY($1)`,
        [testIds],
      );
      rows.forEach((row) => titleMap.set(row.id, row.title));
    }

    const dtos = items.map((attempt) => {
      const totalAnswered = attempt.answers.length;
      const totalCorrect = attempt.answers.filter(
        (answer) => answer.isCorrect === true,
      ).length;

      return new AttemptSummaryResponseDto({
        id: attempt.id,
        testId: attempt.testId,
        testTitle: titleMap.get(attempt.testId) ?? null,
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
