import { VocabularyDefinition } from '../entities/vocabulary-definition.entity';

export class VocabularyWord {
  private constructor(
    private readonly _id: string,
    private readonly _term: string,
    private _phonetic: string | null,
    private _audioUrl: string | null,
    private _cefrLevel: string | null,
    private _definitions: VocabularyDefinition[] = [],
  ) {}

  static create(
    id: string,
    term: string,
    phonetic: string | null,
    audioUrl: string | null,
    cefrLevel: string | null,
    definitions: VocabularyDefinition[],
  ): VocabularyWord {
    return new VocabularyWord(
      id,
      term,
      phonetic,
      audioUrl,
      cefrLevel,
      definitions,
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
}
