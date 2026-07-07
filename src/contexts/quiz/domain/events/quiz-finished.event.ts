export class QuizFinishedEvent {
  constructor(
    public readonly quizId: string,
    public readonly userId: string,
    public readonly score: number,
  ) {}
}
