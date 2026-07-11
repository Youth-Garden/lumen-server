export class ListArticlesQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

export class ListPublicArticlesQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 6,
  ) {}
}

export class GetArticleByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
