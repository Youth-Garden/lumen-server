import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ListArticlesQuery, GetArticleByIdQuery } from './reading.queries';
import { ARTICLE_REPOSITORY } from '../../domain/repositories/article.repository.interface';
import type { IArticleRepository } from '../../domain/repositories/article.repository.interface';
import {
  ArticleListResponseDto,
  ArticleResponseDto,
} from '../dtos/reading.response.dto';

@QueryHandler(ListArticlesQuery)
export class ListArticlesHandler implements IQueryHandler<ListArticlesQuery> {
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
        (a) =>
          new ArticleResponseDto({
            id: a.id,
            title: a.title,
            content: a.content,
            createdAt: a.createdAt,
          }),
      ),
      total,
      page,
      limit,
    };
  }
}

@QueryHandler(GetArticleByIdQuery)
export class GetArticleByIdHandler implements IQueryHandler<GetArticleByIdQuery> {
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
      throw new NotFoundException('Article not found');
    }

    return new ArticleResponseDto({
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
    });
  }
}
