export class DeleteDeckCommand {
  constructor(
    public readonly deckId: string,
    public readonly userId: string,
  ) {}
}
