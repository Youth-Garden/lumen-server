import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListListeningLessonsFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ description: 'Filter by CEFR level' })
  @IsOptional()
  @IsString()
  cefrLevel?: string;
}
