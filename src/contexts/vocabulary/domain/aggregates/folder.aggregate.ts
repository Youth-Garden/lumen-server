import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { FolderCreatedEvent } from '../events/folder-created.event';

export class Folder extends AggregateRoot {
  private constructor(
    private _id: string,
    private _name: string,
    private _description: string | null,
    private _authorId: string,
    private _category: string | null = null,
  ) {
    super();
  }

  static create(
    name: string,
    description: string | null,
    authorId: string,
    category: string | null = null,
  ): Folder {
    const folder = new Folder(
      randomUUID(),
      name,
      description,
      authorId,
      category,
    );
    folder.apply(new FolderCreatedEvent(folder.id));
    return folder;
  }

  static restore(
    id: string,
    name: string,
    description: string | null,
    authorId: string,
    category: string | null = null,
  ): Folder {
    return new Folder(id, name, description, authorId, category);
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
  get category(): string | null {
    return this._category;
  }

  update(name?: string, description?: string | null): void {
    if (name !== undefined) this._name = name;
    if (description !== undefined) this._description = description;
  }
}
