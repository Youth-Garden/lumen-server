export class Flashcard {
  private constructor(
    private readonly _id: string,
    private readonly _deckId: string,
    private readonly _wordId: string,
  ) {}

  static create(id: string, deckId: string, wordId: string): Flashcard {
    return new Flashcard(id, deckId, wordId);
  }

  get id(): string {
    return this._id;
  }
  get deckId(): string {
    return this._deckId;
  }
  get wordId(): string {
    return this._wordId;
  }
}
