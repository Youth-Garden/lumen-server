export class SubmitAnswerCommand {
  constructor(
    public readonly quizId: string,
    public readonly questionId: string,
    public readonly answer: string,
    public readonly userId: string,
  ) {}
}
