import { PaginatedResponseDto } from '../../../../shared/presentation/dtos/paginated-response.dto';

export class ArticleResponseDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly createdAt: Date,
  ) {}
}

export class ArticleListResponseDto extends PaginatedResponseDto<ArticleResponseDto> {}

export class CreateArticleResponseDto {
  constructor(public readonly id: string) {}
}

export class TranslationResponseDto {
  constructor(public readonly translatedText: string) {}
}
