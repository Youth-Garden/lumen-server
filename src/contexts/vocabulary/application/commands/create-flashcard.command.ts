export class CreateFlashcardCommand {
  constructor(
    public readonly deckId: string,
    public readonly wordId: string,
  ) {}
}
