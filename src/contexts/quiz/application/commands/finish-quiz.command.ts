export class FinishQuizCommand {
  constructor(
    public readonly quizId: string,
    public readonly userId: string,
  ) {}
}
