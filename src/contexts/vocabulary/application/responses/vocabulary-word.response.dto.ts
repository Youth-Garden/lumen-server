import { Exclude, Expose, Type } from 'class-transformer';

export class VocabularyExampleResponseDto {
  @Expose()
  id: string;

  @Expose()
  sentenceEn: string;

  @Expose()
  translationVi: string;

  constructor(partial: Partial<VocabularyExampleResponseDto>) {
    Object.assign(this, partial);
  }
}

export class VocabularyDefinitionResponseDto {
  @Expose()
  id: string;

  @Expose()
  partOfSpeech: string;

  @Expose()
  definitionEn: string;

  @Expose()
  translationVi: string;

  @Expose()
  @Type(() => VocabularyExampleResponseDto)
  examples: VocabularyExampleResponseDto[];

  constructor(partial: Partial<VocabularyDefinitionResponseDto>) {
    Object.assign(this, partial);
  }
}

export class VocabularyWordResponseDto {
  @Expose()
  id: string;

  @Expose()
  term: string;

  @Expose()
  phonetic: string | null;

  @Expose()
  audioUrl: string | null;

  @Expose()
  cefrLevel: string | null;

  @Expose()
  @Type(() => VocabularyDefinitionResponseDto)
  definitions: VocabularyDefinitionResponseDto[];

  constructor(partial: Partial<VocabularyWordResponseDto>) {
    Object.assign(this, partial);
  }
}
