export class SubmitGrammarExerciseCommand {
  constructor(
    public readonly exerciseId: string,
    public readonly userId: string,
    public readonly answer: string,
  ) {}
}
