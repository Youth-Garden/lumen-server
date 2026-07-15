export class QuizCompletedEvent {
  constructor(
    public readonly userId: string,
    public readonly quizId: string,
    public readonly score: number, // e.g. final score out of 100
  ) {}
}
