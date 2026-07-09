import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ToeicTestResponseDto } from '../responses/toeic-test.response.dto';
import { AppException } from '../../../../shared-kernel/exceptions';
import { ToeicEx } from '../../domain/exceptions/toeic.exception';
import { TOEIC_QUERY_REPOSITORY } from '../ports/toeic-query.repository';
import type { IToeicQueryRepository } from '../ports/toeic-query.repository';

export class GetToeicTestByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetToeicTestByIdQuery)
export class GetToeicTestByIdHandler implements IQueryHandler<
  GetToeicTestByIdQuery,
  ToeicTestResponseDto
> {
  constructor(
    @Inject(TOEIC_QUERY_REPOSITORY)
    private readonly toeicQueryRepository: IToeicQueryRepository,
  ) {}

  async execute(query: GetToeicTestByIdQuery): Promise<ToeicTestResponseDto> {
    const test = await this.toeicQueryRepository.findPublishedTestById(
      query.id,
    );

    if (!test) {
      throw new AppException(ToeicEx.TestNotFound);
    }

    return test;
  }
}
