export class ListArticlesQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

export class GetArticleByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
