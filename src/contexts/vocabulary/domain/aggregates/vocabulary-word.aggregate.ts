import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { VocabularyDefinition } from '../entities/vocabulary-definition.entity';

export class VocabularyWord extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _term: string,
    private _phonetic: string | null,
    private _audioUrl: string | null,
    private _cefrLevel: string | null,
    private _definitions: VocabularyDefinition[] = [],
    private _imageUrl: string | null = null,
  ) {
    super();
  }

  static create(
    term: string,
    phonetic: string | null,
    audioUrl: string | null,
    cefrLevel: string | null,
    definitions: VocabularyDefinition[],
    imageUrl: string | null = null,
  ): VocabularyWord {
    return new VocabularyWord(
      randomUUID(),
      term,
      phonetic,
      audioUrl,
      cefrLevel,
      definitions,
      imageUrl,
    );
  }

  static restore(
    id: string,
    term: string,
    phonetic: string | null,
    audioUrl: string | null,
    cefrLevel: string | null,
    definitions: VocabularyDefinition[],
    imageUrl: string | null = null,
  ): VocabularyWord {
    return new VocabularyWord(
      id,
      term,
      phonetic,
      audioUrl,
      cefrLevel,
      definitions,
      imageUrl,
    );
  }

  get id(): string {
    return this._id;
  }

  get term(): string {
    return this._term;
  }

  get phonetic(): string | null {
    return this._phonetic;
  }

  get audioUrl(): string | null {
    return this._audioUrl;
  }

  get cefrLevel(): string | null {
    return this._cefrLevel;
  }

  get definitions(): VocabularyDefinition[] {
    return this._definitions;
  }

  get imageUrl(): string | null {
    return this._imageUrl;
  }

  update(
    term?: string,
    phonetic?: string | null,
    audioUrl?: string | null,
    cefrLevel?: string | null,
    definitions?: VocabularyDefinition[],
    imageUrl?: string | null,
  ): void {
    if (term !== undefined) this._term = term;
    if (phonetic !== undefined) this._phonetic = phonetic;
    if (audioUrl !== undefined) this._audioUrl = audioUrl;
    if (cefrLevel !== undefined) this._cefrLevel = cefrLevel;
    if (definitions !== undefined) this._definitions = definitions;
    if (imageUrl !== undefined) this._imageUrl = imageUrl;
  }
}
