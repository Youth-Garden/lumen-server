import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetArticleByIdQuery } from './reading.queries';
import { ARTICLE_REPOSITORY } from '../../domain/repositories/article.repository.interface';
import type { IArticleRepository } from '../../domain/repositories/article.repository.interface';
import { ArticleResponseDto } from '../responses/reading.response.dto';
import { AppException } from '../../../../shared-kernel/exceptions';
import { ReadingEx } from '../../domain/exceptions/reading.exceptions';

@QueryHandler(GetArticleByIdQuery)
export class GetArticleByIdHandler implements IQueryHandler<
  GetArticleByIdQuery,
  ArticleResponseDto
> {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepo: IArticleRepository,
  ) {}

  async execute(query: GetArticleByIdQuery): Promise<ArticleResponseDto> {
    const article = await this.articleRepo.findByIdAndUserId(
      query.id,
      query.userId,
    );
    if (!article) {
      throw new AppException(ReadingEx.ArticleNotFound);
    }

    return new ArticleResponseDto(
      article.id,
      article.title,
      article.content,
      article.createdAt,
    );
  }
}
