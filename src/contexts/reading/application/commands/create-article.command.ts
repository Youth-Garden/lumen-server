export class CreateArticleCommand {
  constructor(
    public readonly dto: { title: string; content: string },
    public readonly userId: string,
  ) {}
}
