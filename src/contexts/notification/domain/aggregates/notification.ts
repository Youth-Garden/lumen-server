import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

export class Notification extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _title: string,
    private readonly _description: string,
    private _isRead: boolean,
    private readonly _createdAt: Date,
  ) {
    super();
  }

  static create(userId: string, title: string, description: string): Notification {
    // We would use a UUID generator, but the repository/DB will assign it if we don't, 
    // or we can just pass an empty string and let DB handle it, but for DDD it's better to pass generated ID.
    // However, looking at the user aggregates, they often generate UUIDs in the aggregate. 
    // I will use a simple string for now and it will be replaced by the DB or standard UUID generator.
    const id = randomUUID();
    return new Notification(id, userId, title, description, false, new Date());
  }

  static restore(
    id: string,
    userId: string,
    title: string,
    description: string,
    isRead: boolean,
    createdAt: Date,
  ): Notification {
    return new Notification(id, userId, title, description, isRead, createdAt);
  }

  markAsRead(): void {
    if (!this._isRead) {
      this._isRead = true;
      // Emitting an event might be needed, but not strictly required for this simple feature
    }
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
