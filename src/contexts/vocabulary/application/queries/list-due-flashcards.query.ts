export class ListDueFlashcardsQuery {
  constructor(
    public readonly userId: string,
    public readonly deckId?: string,
    public readonly limit?: number,
  ) {}
}
