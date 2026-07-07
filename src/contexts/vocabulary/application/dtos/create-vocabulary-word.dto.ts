import {
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVocabularyExampleDto {
  @IsString()
  @IsNotEmpty()
  sentenceEn: string;

  @IsString()
  @IsNotEmpty()
  translationVi: string;
}

export class CreateVocabularyDefinitionDto {
  @IsString()
  @IsNotEmpty()
  partOfSpeech: string;

  @IsString()
  @IsNotEmpty()
  definitionEn: string;

  @IsString()
  @IsNotEmpty()
  translationVi: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVocabularyExampleDto)
  examples: CreateVocabularyExampleDto[];
}

export class CreateVocabularyWordDto {
  @IsString()
  @IsNotEmpty()
  term: string;

  @IsString()
  @IsOptional()
  phonetic: string | null;

  @IsString()
  @IsOptional()
  audioUrl: string | null;

  @IsString()
  @IsOptional()
  cefrLevel: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVocabularyDefinitionDto)
  definitions: CreateVocabularyDefinitionDto[];
}
