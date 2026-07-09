export class CreateArticleDto {
  title: string;
  content: string;
}

export class ArticleResponseDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export class ArticleListResponseDto {
  items: ArticleResponseDto[];
  total: number;
  page: number;
  limit: number;
}
