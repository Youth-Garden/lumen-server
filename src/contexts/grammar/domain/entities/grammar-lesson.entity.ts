export class GrammarLesson {
  constructor(
    public readonly id: string,
    public readonly topicId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly orderIndex: number,
  ) {}
}
