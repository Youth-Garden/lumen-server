import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListGrammarTopicsQuery } from './list-grammar-topics.query';
import { GRAMMAR_TOPIC_REPOSITORY } from '../../domain/repositories/grammar-topic.repository.interface';
import type { IGrammarTopicRepository } from '../../domain/repositories/grammar-topic.repository.interface';
import { GrammarTopicResponseDto } from '../responses/grammar-topic.response.dto';
import { PaginatedResponseDto } from '../../../../shared-kernel/dtos/paginated-response.dto';

@QueryHandler(ListGrammarTopicsQuery)
export class ListGrammarTopicsHandler implements IQueryHandler<
  ListGrammarTopicsQuery,
  PaginatedResponseDto<GrammarTopicResponseDto>
> {
  constructor(
    @Inject(GRAMMAR_TOPIC_REPOSITORY)
    private readonly repo: IGrammarTopicRepository,
  ) {}

  async execute(
    query: ListGrammarTopicsQuery,
  ): Promise<PaginatedResponseDto<GrammarTopicResponseDto>> {
    const result = await this.repo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      cefrLevel: query.cefrLevel,
    });

    return new PaginatedResponseDto<GrammarTopicResponseDto>(
      result.items.map((item) => new GrammarTopicResponseDto(item)),
      result.total,
    );
  }
}
