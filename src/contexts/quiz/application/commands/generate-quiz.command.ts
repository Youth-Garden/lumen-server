export class GenerateQuizCommand {
  constructor(
    public readonly limit: number,
    public readonly userId: string,
  ) {}
}
