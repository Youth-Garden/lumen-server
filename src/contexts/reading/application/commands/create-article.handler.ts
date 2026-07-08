import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArticleCommand } from './create-article.command';
import { ARTICLE_REPOSITORY } from '../../domain/repositories/article.repository.interface';
import type { IArticleRepository } from '../../domain/repositories/article.repository.interface';
import { Article } from '../../domain/entities/article';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepo: IArticleRepository,
  ) {}

  async execute(command: CreateArticleCommand): Promise<string> {
    const { dto, userId } = command;
    const articleId = uuidv4();

    const article = Article.create(articleId, dto.title, dto.content, userId);
    await this.articleRepo.save(article);

    return articleId;
  }
}
