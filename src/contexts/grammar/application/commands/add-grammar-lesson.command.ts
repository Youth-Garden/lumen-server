export class AddGrammarLessonCommand {
  constructor(
    public readonly topicId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly orderIndex: number,
  ) {}
}
