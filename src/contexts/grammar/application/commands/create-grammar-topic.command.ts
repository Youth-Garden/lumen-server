export class CreateGrammarTopicCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly cefrLevel: string,
  ) {}
}
