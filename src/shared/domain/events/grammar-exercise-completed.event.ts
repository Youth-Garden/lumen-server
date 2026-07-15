export class GrammarExerciseCompletedEvent {
  constructor(
    public readonly aggregateId: string, // the user ID who completed it
    public readonly exerciseId: string,
    public readonly lessonId: string,
  ) {}
}
