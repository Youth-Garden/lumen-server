import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

export class Flashcard extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _folderId: string,
    private readonly _wordId: string,
  ) {
    super();
  }

  static create(folderId: string, wordId: string): Flashcard {
    return new Flashcard(randomUUID(), folderId, wordId);
  }

  static restore(id: string, folderId: string, wordId: string): Flashcard {
    return new Flashcard(id, folderId, wordId);
  }

  get id(): string {
    return this._id;
  }
  get folderId(): string {
    return this._folderId;
  }
  get wordId(): string {
    return this._wordId;
  }
}
