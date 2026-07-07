export class Deck {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string | null,
    private readonly _authorId: string | null,
  ) {}

  static create(
    id: string,
    name: string,
    description: string | null,
    authorId: string | null,
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
  get authorId(): string | null {
    return this._authorId;
  }
}
