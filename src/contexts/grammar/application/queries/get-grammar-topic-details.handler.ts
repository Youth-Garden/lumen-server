import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetGrammarTopicDetailsQuery } from './get-grammar-topic-details.query';
import { GRAMMAR_TOPIC_REPOSITORY } from '../../domain/repositories/grammar-topic.repository.interface';
import type { IGrammarTopicRepository } from '../../domain/repositories/grammar-topic.repository.interface';
import { GrammarTopicResponseDto } from '../responses/grammar-topic.response.dto';
import { AppException } from '../../../../common/exceptions/app.exception';
import { GrammarEx } from '../../domain/exceptions/grammar.exception';

@QueryHandler(GetGrammarTopicDetailsQuery)
export class GetGrammarTopicDetailsHandler implements IQueryHandler<
  GetGrammarTopicDetailsQuery,
  GrammarTopicResponseDto
> {
  constructor(
    @Inject(GRAMMAR_TOPIC_REPOSITORY)
    private readonly repo: IGrammarTopicRepository,
  ) {}

  async execute(
    query: GetGrammarTopicDetailsQuery,
  ): Promise<GrammarTopicResponseDto> {
    const topic = await this.repo.findById(query.id);
    if (!topic) {
      throw new AppException(GrammarEx.TopicNotFound);
    }

    return new GrammarTopicResponseDto(topic);
  }
}
