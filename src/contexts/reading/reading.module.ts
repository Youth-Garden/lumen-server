import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingController } from './presentation/http/reading.controller';
import {
  TranslateTextHandler,
  TRANSLATION_PORT,
} from './application/handlers/translate-text.handler';
import { ListArticlesHandler } from './application/queries/list-articles.handler';
import { GetArticleByIdHandler } from './application/queries/get-article-by-id.handler';
import { MyMemoryTranslationAdapter } from './infrastructure/adapters/mymemory-translation.adapter';
import { ArticleEntity } from './infrastructure/entities/article.entity';
import { ARTICLE_REPOSITORY } from './domain/repositories/article.repository.interface';
import { ArticleRepository } from './infrastructure/repositories/article.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ReadingController],
  providers: [
    TranslateTextHandler,
    ListArticlesHandler,
    GetArticleByIdHandler,
    {
      provide: TRANSLATION_PORT,
      useClass: MyMemoryTranslationAdapter,
    },
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepository,
    },
  ],
})
export class ReadingModule {}
