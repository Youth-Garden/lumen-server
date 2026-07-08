import { Article } from '../../domain/entities/article';

export const ARTICLE_REPOSITORY = 'ARTICLE_REPOSITORY';

export interface IArticleRepository {
  save(article: Article): Promise<void>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ items: Article[]; total: number }>;
  findByIdAndUserId(id: string, userId: string): Promise<Article | null>;
  delete(id: string, userId: string): Promise<void>;
}
