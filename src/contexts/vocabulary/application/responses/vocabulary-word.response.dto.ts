import { Expose, Type } from 'class-transformer';
import type { I18nString } from '../../../../shared/domain/types/translation.type';
import { WordRelationResponseDto } from './word-relation.response.dto';

export class VocabularyExampleResponseDto {
  @Expose()
  id: string;

  @Expose()
  sentence: I18nString;

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
  definition: I18nString;

  @Expose()
  @Type(() => VocabularyExampleResponseDto)
  examples: VocabularyExampleResponseDto[];

  @Expose()
  @Type(() => WordRelationResponseDto)
  relations: WordRelationResponseDto[] = [];

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
  topic: I18nString | null;

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

  @Expose()
  @Type(() => WordRelationResponseDto)
  relations: WordRelationResponseDto[] = [];

  constructor(partial: Partial<VocabularyWordResponseDto>) {
    Object.assign(this, partial);
  }
}
