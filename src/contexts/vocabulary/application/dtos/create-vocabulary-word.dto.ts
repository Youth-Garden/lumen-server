import {
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVocabularyExampleDto {
  @ApiProperty({ example: 'This is an example sentence.' })
  @IsString()
  @IsNotEmpty()
  sentenceEn: string;

  @ApiProperty({ example: 'Đây là một câu ví dụ.' })
  @IsString()
  @IsNotEmpty()
  translationVi: string;
}

export class CreateVocabularyDefinitionDto {
  @ApiProperty({ example: 'noun' })
  @IsString()
  @IsNotEmpty()
  partOfSpeech: string;

  @ApiProperty({
    example:
      'A word used to identify any of a class of people, places, or things.',
  })
  @IsString()
  @IsNotEmpty()
  definitionEn: string;

  @ApiProperty({ example: 'Danh từ' })
  @IsString()
  @IsNotEmpty()
  translationVi: string;

  @ApiProperty({ type: [CreateVocabularyExampleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVocabularyExampleDto)
  examples: CreateVocabularyExampleDto[];
}

export class CreateVocabularyWordDto {
  @ApiProperty({ example: 'apple' })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({ example: '/ˈæpəl/' })
  @IsString()
  @IsOptional()
  phonetic: string | null;

  @ApiPropertyOptional({ example: '/ˈæpəl/' })
  @IsString()
  @IsOptional()
  phoneticUs?: string | null;

  @ApiPropertyOptional({ example: '/ˈæp.əl/' })
  @IsString()
  @IsOptional()
  phoneticUk?: string | null;

  @ApiPropertyOptional({ example: 'https://audio.com/apple.mp3' })
  @IsString()
  @IsOptional()
  audioUrl: string | null;

  @ApiPropertyOptional({ example: 'https://audio.com/apple-us.mp3' })
  @IsString()
  @IsOptional()
  audioUsUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://audio.com/apple-uk.mp3' })
  @IsString()
  @IsOptional()
  audioUkUrl?: string | null;

  @IsString()
  @IsOptional()
  cefrLevel: string | null;

  @ApiProperty({ type: [CreateVocabularyDefinitionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVocabularyDefinitionDto)
  definitions: CreateVocabularyDefinitionDto[];
}
