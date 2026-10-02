import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { VocabularyDefinition } from '../entities/vocabulary-definition.entity';
import { VocabularyWordRelation } from '../entities/vocabulary-word-relation.entity';

export class VocabularyWord extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _term: string,
    private _phonetic: string | null,
    private _audioUrl: string | null,
    private _cefrLevel: string | null,
    private _definitions: VocabularyDefinition[] = [],
    private _imageUrl: string | null = null,
    private _audioUsUrl: string | null = null,
    private _audioUkUrl: string | null = null,
    private _phoneticUs: string | null = null,
    private _phoneticUk: string | null = null,
    private _relations: VocabularyWordRelation[] = [],
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
    audioUsUrl: string | null = null,
    audioUkUrl: string | null = null,
    phoneticUs: string | null = null,
    phoneticUk: string | null = null,
    relations: VocabularyWordRelation[] = [],
  ): VocabularyWord {
    return new VocabularyWord(
      randomUUID(),
      term,
      phonetic,
      audioUrl,
      cefrLevel,
      definitions,
      imageUrl,
      audioUsUrl,
      audioUkUrl,
      phoneticUs,
      phoneticUk,
      relations,
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
    audioUsUrl: string | null = null,
    audioUkUrl: string | null = null,
    phoneticUs: string | null = null,
    phoneticUk: string | null = null,
    relations: VocabularyWordRelation[] = [],
  ): VocabularyWord {
    return new VocabularyWord(
      id,
      term,
      phonetic,
      audioUrl,
      cefrLevel,
      definitions,
      imageUrl,
      audioUsUrl,
      audioUkUrl,
      phoneticUs,
      phoneticUk,
      relations,
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

  get phoneticUs(): string | null {
    return this._phoneticUs;
  }

  get phoneticUk(): string | null {
    return this._phoneticUk;
  }

  get audioUrl(): string | null {
    return this._audioUrl;
  }

  get audioUsUrl(): string | null {
    return this._audioUsUrl;
  }

  get audioUkUrl(): string | null {
    return this._audioUkUrl;
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

  get relations(): VocabularyWordRelation[] {
    return this._relations;
  }

  update(
    term?: string,
    phonetic?: string | null,
    audioUrl?: string | null,
    cefrLevel?: string | null,
    definitions?: VocabularyDefinition[],
    imageUrl?: string | null,
    audioUsUrl?: string | null,
    audioUkUrl?: string | null,
    phoneticUs?: string | null,
    phoneticUk?: string | null,
    relations?: VocabularyWordRelation[],
  ): void {
    if (term !== undefined) this._term = term;
    if (phonetic !== undefined) this._phonetic = phonetic;
    if (audioUrl !== undefined) this._audioUrl = audioUrl;
    if (cefrLevel !== undefined) this._cefrLevel = cefrLevel;
    if (definitions !== undefined) this._definitions = definitions;
    if (imageUrl !== undefined) this._imageUrl = imageUrl;
    if (audioUsUrl !== undefined) this._audioUsUrl = audioUsUrl;
    if (audioUkUrl !== undefined) this._audioUkUrl = audioUkUrl;
    if (phoneticUs !== undefined) this._phoneticUs = phoneticUs;
    if (phoneticUk !== undefined) this._phoneticUk = phoneticUk;
    if (relations !== undefined) this._relations = relations;
  }
}
