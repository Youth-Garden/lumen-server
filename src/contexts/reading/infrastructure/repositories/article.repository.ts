import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Article } from '../../domain/entities/article';
import {
  IArticleRepository,
  ArticleListResult,
} from '../../domain/repositories/article.repository.interface';

@Injectable()
export class ArticleRepository
  extends BaseRepository<ArticleEntity>
  implements IArticleRepository
{
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {
    super(articleRepo);
  }

  async save(article: Article): Promise<void> {
    const entity = new ArticleEntity();
    entity.id = article.id;
    entity.title = article.title;
    entity.content = article.content;
    entity.userId = article.userId;
    entity.createdAt = article.createdAt;

    await this.articleRepo.save(entity);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<ArticleListResult> {
    const [entities, total] = await this.articleRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const items = entities.map((entity) =>
      Article.create(
        entity.id,
        entity.title,
        entity.content,
        entity.userId,
        entity.createdAt,
      ),
    );

    return { items, total };
  }

  async findLatest(page: number, limit: number): Promise<ArticleListResult> {
    const [entities, total] = await this.articleRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const items = entities.map((entity) =>
      Article.create(
        entity.id,
        entity.title,
        entity.content,
        entity.userId,
        entity.createdAt,
      ),
    );

    return { items, total };
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Article | null> {
    const entity = await this.articleRepo.findOne({
      where: { id, userId },
    });

    if (!entity) return null;

    return Article.create(
      entity.id,
      entity.title,
      entity.content,
      entity.userId,
      entity.createdAt,
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.articleRepo.delete({ id, userId });
  }
}
