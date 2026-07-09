export class UpdateDeckCommand {
  constructor(
    public readonly deckId: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly description?: string | null,
  ) {}
}
