import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppException } from '../../../../common/exceptions';
import { ToeicEx } from '../../domain/exceptions/toeic.exception';
import type { IToeicQueryRepository } from '../ports/toeic-query.repository';
import { TOEIC_QUERY_REPOSITORY } from '../ports/toeic-query.repository';
import { ToeicTestResponseDto } from '../responses/toeic-test.response.dto';

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
