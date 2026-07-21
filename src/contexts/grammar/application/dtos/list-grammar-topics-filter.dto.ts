import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListGrammarTopicsFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ description: 'Filter by CEFR level' })
  @IsOptional()
  @IsString()
  cefrLevel?: string;

  @ApiPropertyOptional({ description: 'Filter by topic category' })
  @IsOptional()
  @IsString()
  category?: string;
}
