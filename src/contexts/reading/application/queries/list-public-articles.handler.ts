import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListPublicArticlesQuery } from './reading.queries';
import { ARTICLE_REPOSITORY } from '../../domain/repositories/article.repository.interface';
import type { IArticleRepository } from '../../domain/repositories/article.repository.interface';
import {
  ArticleListResponseDto,
  ArticleResponseDto,
} from '../responses/reading.response.dto';

@QueryHandler(ListPublicArticlesQuery)
export class ListPublicArticlesHandler implements IQueryHandler<
  ListPublicArticlesQuery,
  ArticleListResponseDto
> {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepo: IArticleRepository,
  ) {}

  async execute(
    query: ListPublicArticlesQuery,
  ): Promise<ArticleListResponseDto> {
    const { page, limit } = query;
    const { items, total } = await this.articleRepo.findLatest(page, limit);

    const mappedItems = items.map(
      (article) =>
        new ArticleResponseDto(
          article.id,
          article.title,
          article.content,
          article.createdAt,
        ),
    );

    return new ArticleListResponseDto(mappedItems, total, page, limit);
  }
}
