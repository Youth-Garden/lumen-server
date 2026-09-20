import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { FolderCreatedEvent } from '../events/folder-created.event';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export type { I18nString };

export class Folder extends AggregateRoot {
  private constructor(
    private _id: string,
    private _name: I18nString,
    private _description: I18nString | null,
    private _authorId: string,
    private _category: I18nString | null = null,
    private _isSystem: boolean = false,
  ) {
    super();
  }

  static create(
    name: I18nString,
    description: I18nString | null,
    authorId: string,
    category: I18nString | null = null,
    isSystem: boolean = false,
  ): Folder {
    const folder = new Folder(
      randomUUID(),
      name,
      description,
      authorId,
      category,
      isSystem,
    );
    folder.apply(new FolderCreatedEvent(folder.id));
    return folder;
  }

  static restore(
    id: string,
    name: I18nString,
    description: I18nString | null,
    authorId: string,
    category: I18nString | null = null,
    isSystem: boolean = false,
  ): Folder {
    return new Folder(id, name, description, authorId, category, isSystem);
  }

  get id(): string {
    return this._id;
  }
  get name(): I18nString {
    return this._name;
  }
  get description(): I18nString | null {
    return this._description;
  }
  get authorId(): string {
    return this._authorId;
  }
  get category(): I18nString | null {
    return this._category;
  }
  get isSystem(): boolean {
    return this._isSystem;
  }

  getLocalizedName(locale: string = 'en', fallback: string = 'en'): string {
    if (typeof this._name === 'string') return this._name;
    if (this._name && typeof this._name === 'object') {
      const map = this._name as Record<string, string | undefined>;
      return map[locale] || map[fallback] || Object.values(map)[0] || '';
    }
    return '';
  }

  getLocalizedCategory(
    locale: string = 'en',
    fallback: string = 'en',
  ): string | null {
    if (!this._category) return null;
    if (typeof this._category === 'string') return this._category;
    if (typeof this._category === 'object') {
      const map = this._category as Record<string, string | undefined>;
      return map[locale] || map[fallback] || Object.values(map)[0] || null;
    }
    return null;
  }

  getLocalizedDescription(
    locale: string = 'en',
    fallback: string = 'en',
  ): string | null {
    if (!this._description) return null;
    if (typeof this._description === 'string') return this._description;
    if (typeof this._description === 'object') {
      const map = this._description as Record<string, string | undefined>;
      return map[locale] || map[fallback] || Object.values(map)[0] || null;
    }
    return null;
  }

  update(
    name?: I18nString,
    description?: I18nString | null,
    category?: I18nString | null,
  ): void {
    if (name !== undefined) this._name = name;
    if (description !== undefined) this._description = description;
    if (category !== undefined) this._category = category;
  }
}
