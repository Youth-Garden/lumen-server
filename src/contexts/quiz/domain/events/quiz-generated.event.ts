export class QuizGeneratedEvent {
  constructor(
    public readonly quizId: string,
    public readonly userId: string,
  ) {}
}
