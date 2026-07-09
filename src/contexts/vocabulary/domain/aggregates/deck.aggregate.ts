import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DeckCreatedEvent } from '../events/deck-created.event';

export class Deck extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string | null,
    private readonly _authorId: string,
  ) {
    super();
  }

  static create(
    name: string,
    description: string | null,
    authorId: string,
  ): Deck {
    const deck = new Deck(randomUUID(), name, description, authorId);
    deck.apply(new DeckCreatedEvent(deck.id));
    return deck;
  }

  static restore(
    id: string,
    name: string,
    description: string | null,
    authorId: string,
  ): Deck {
    return new Deck(id, name, description, authorId);
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get authorId(): string {
    return this._authorId;
  }

  update(name?: string, description?: string | null): void {
    if (name !== undefined) this._name = name;
    if (description !== undefined) this._description = description;
  }
}
