import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { IArticleRepository } from '../../domain/repositories/article.repository.interface';
import { ARTICLE_REPOSITORY } from '../../domain/repositories/article.repository.interface';
import {
  ArticleListResponseDto,
  ArticleResponseDto,
} from '../responses/reading.response.dto';
import { ListArticlesQuery } from './reading.queries';

@QueryHandler(ListArticlesQuery)
export class ListArticlesHandler implements IQueryHandler<
  ListArticlesQuery,
  ArticleListResponseDto
> {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepo: IArticleRepository,
  ) {}

  async execute(query: ListArticlesQuery): Promise<ArticleListResponseDto> {
    const { userId, page, limit } = query;
    const { items, total } = await this.articleRepo.findByUserId(
      userId,
      page,
      limit,
    );

    return {
      items: items.map(
        (article) =>
          new ArticleResponseDto(
            article.id,
            article.title,
            article.content,
            article.createdAt,
          ),
      ),
      total,
      page,
      limit,
    };
  }
}
