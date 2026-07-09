export class AddGrammarExerciseCommand {
  constructor(
    public readonly lessonId: string,
    public readonly questionText: string,
    public readonly options: string[],
    public readonly correctAnswer: string,
    public readonly explanation: string,
  ) {}
}
