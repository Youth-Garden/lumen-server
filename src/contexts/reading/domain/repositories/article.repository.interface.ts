import { Article } from '../../domain/entities/article';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');

export interface ArticleListResult {
  items: Article[];
  total: number;
}

export interface IArticleRepository {
  save(article: Article): Promise<void>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<ArticleListResult>;
  findLatest(page: number, limit: number): Promise<ArticleListResult>;
  findByIdAndUserId(id: string, userId: string): Promise<Article | null>;
  delete(id: string, userId: string): Promise<void>;
}
