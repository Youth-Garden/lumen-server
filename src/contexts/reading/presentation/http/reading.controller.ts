import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query as QueryParam,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateArticleDto } from '../../application/dtos/reading.dto';
import {
  ArticleResponseDto,
  ArticleListResponseDto,
  CreateArticleResponseDto,
  TranslationResponseDto,
} from '../../application/responses/reading.response.dto';
import { CreateArticleCommand } from '../../application/commands/create-article.command';
import {
  ListArticlesQuery,
  GetArticleByIdQuery,
  ListPublicArticlesQuery,
} from '../../application/queries/reading.queries';

import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { TranslateTextQuery } from '../../application/queries/translate-text.query';

@ApiTags('Reading')
@Controller('reading')
export class ReadingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('articles')
  @ApiOperation({ summary: 'Save a new article' })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: 201,
    description: 'Article saved successfully.',
    type: CreateArticleResponseDto,
  })
  async createArticle(
    @Body() dto: CreateArticleDto,
    @CurrentUser() userId: string,
  ): Promise<CreateArticleResponseDto> {
    const id = await this.commandBus.execute<CreateArticleCommand, string>(
      new CreateArticleCommand(dto, userId),
    );
    return new CreateArticleResponseDto(id);
  }

  @Get('articles')
  @ApiOperation({ summary: 'List reading articles' })
  @ApiResponse({ status: 200, type: ArticleListResponseDto })
  async listArticles(
    @CurrentUser() userId: string,
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 20,
  ): Promise<ArticleListResponseDto> {
    return this.queryBus.execute<ListArticlesQuery, ArticleListResponseDto>(
      new ListArticlesQuery(userId, page, limit),
    );
  }

  @Get('articles/public')
  @Public()
  @ApiOperation({ summary: 'List latest public articles (no auth)' })
  @ApiResponse({ status: 200, type: ArticleListResponseDto })
  async listPublicArticles(
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 6,
  ): Promise<ArticleListResponseDto> {
    return this.queryBus.execute<
      ListPublicArticlesQuery,
      ArticleListResponseDto
    >(new ListPublicArticlesQuery(page, limit));
  }

  @Get('articles/:id')
  @ApiOperation({ summary: 'Get article details' })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  async getArticleById(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ArticleResponseDto> {
    return this.queryBus.execute<GetArticleByIdQuery, ArticleResponseDto>(
      new GetArticleByIdQuery(id, userId),
    );
  }

  @Get('translate')
  @ApiOperation({ summary: 'Auto-translate text (proxy)' })
  @ApiResponse({
    status: 200,
    description: 'Returns translated text.',
    type: TranslationResponseDto,
  })
  async translateText(
    @QueryParam('text') text: string,
  ): Promise<TranslationResponseDto> {
    if (!text) return new TranslationResponseDto('');

    const result = await this.queryBus.execute<TranslateTextQuery, string>(
      new TranslateTextQuery(text),
    );
    return new TranslationResponseDto(result);
  }
}
