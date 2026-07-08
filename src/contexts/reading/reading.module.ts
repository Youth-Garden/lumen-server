import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ArticleEntity } from './infrastructure/typeorm/entities/article.entity';
import { ReadingController } from './presentation/http/reading.controller';
import { CreateArticleHandler } from './application/commands/create-article.handler';
import {
  ListArticlesHandler,
  GetArticleByIdHandler,
} from './application/queries/reading.handlers';
import { ARTICLE_REPOSITORY } from './domain/repositories/article.repository.interface';
import { ArticleRepository } from './infrastructure/typeorm/repositories/article.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ReadingController],
  providers: [
    CreateArticleHandler,
    ListArticlesHandler,
    GetArticleByIdHandler,
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepository,
    },
  ],
})
export class ReadingModule {}
