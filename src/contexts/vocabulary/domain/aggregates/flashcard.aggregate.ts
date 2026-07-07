import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

export class Flashcard extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _deckId: string,
    private readonly _wordId: string,
  ) {
    super();
  }

  static create(deckId: string, wordId: string): Flashcard {
    return new Flashcard(randomUUID(), deckId, wordId);
  }

  static restore(id: string, deckId: string, wordId: string): Flashcard {
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
