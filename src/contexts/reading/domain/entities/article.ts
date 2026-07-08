export class Article {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly userId: string,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    title: string,
    content: string,
    userId: string,
    createdAt: Date = new Date(),
  ): Article {
    return new Article(id, title, content, userId, createdAt);
  }
}
