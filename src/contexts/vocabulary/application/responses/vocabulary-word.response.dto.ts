import { Expose, Type } from 'class-transformer';
import type { TranslationRecord } from '../../../../shared/domain/types/translation.type';

export class VocabularyExampleResponseDto {
  @Expose()
  id: string;

  @Expose()
  sentence: TranslationRecord;

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
  definition: TranslationRecord;

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
  topic: string | null;

  @Expose()
  topicVi: string | null;

  @Expose()
  topicImageUrl: string | null;

  @Expose()
  phonetic: string | null;

  @Expose()
  phoneticUs: string | null;

  @Expose()
  phoneticUk: string | null;

  @Expose()
  audioUrl: string | null;

  @Expose()
  audioUsUrl: string | null;

  @Expose()
  audioUkUrl: string | null;

  @Expose()
  cefrLevel: string | null;

  @Expose()
  imageUrl: string | null;

  @Expose()
  @Type(() => VocabularyDefinitionResponseDto)
  definitions: VocabularyDefinitionResponseDto[];

  constructor(partial: Partial<VocabularyWordResponseDto>) {
    Object.assign(this, partial);
  }
}
