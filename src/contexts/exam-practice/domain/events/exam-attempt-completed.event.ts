export class ExamAttemptCompletedEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
    public readonly testId: string,
    public readonly totalScore: number,
  ) {}
}
