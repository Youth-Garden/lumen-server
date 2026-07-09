import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ToeicTestResponseDto } from '../responses/toeic-test.response.dto';
import { TOEIC_QUERY_REPOSITORY } from '../ports/toeic-query.repository';
import type { IToeicQueryRepository } from '../ports/toeic-query.repository';

export class ListToeicTestsQuery implements IQuery {}

@QueryHandler(ListToeicTestsQuery)
export class ListToeicTestsHandler implements IQueryHandler<
  ListToeicTestsQuery,
  ToeicTestResponseDto[]
> {
  constructor(
    @Inject(TOEIC_QUERY_REPOSITORY)
    private readonly toeicQueryRepository: IToeicQueryRepository,
  ) {}

  async execute(): Promise<ToeicTestResponseDto[]> {
    return this.toeicQueryRepository.findPublishedTests();
  }
}
