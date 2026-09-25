import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class Notification extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _title: I18nString,
    private readonly _description: I18nString,
    private _isRead: boolean,
    private readonly _createdAt: Date,
  ) {
    super();
  }

  static create(
    userId: string,
    title: I18nString,
    description: I18nString,
  ): Notification {
    const id = randomUUID();
    return new Notification(id, userId, title, description, false, new Date());
  }

  static restore(
    id: string,
    userId: string,
    title: I18nString,
    description: I18nString,
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

  get title(): I18nString {
    return this._title;
  }

  get description(): I18nString {
    return this._description;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
