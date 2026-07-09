export class ArticleResponseDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly createdAt: Date,
  ) {}
}

export class ArticleListResponseDto {
  constructor(
    public readonly items: ArticleResponseDto[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

export class CreateArticleResponseDto {
  constructor(public readonly id: string) {}
}

export class TranslationResponseDto {
  constructor(public readonly translatedText: string) {}
}
