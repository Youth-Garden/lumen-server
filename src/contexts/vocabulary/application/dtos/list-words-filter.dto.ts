import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListWordsFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ description: 'Filter by CEFR Level (e.g., A1, B2)' })
  @IsOptional()
  @IsString()
  cefrLevel?: string;

  @ApiPropertyOptional({
    description: 'Filter by Part of Speech (e.g., noun, verb)',
  })
  @IsOptional()
  @IsString()
  partOfSpeech?: string;
}
