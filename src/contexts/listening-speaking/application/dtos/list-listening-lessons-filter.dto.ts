import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from '../../../../shared-kernel/dtos/pagination.dto';

export class ListListeningLessonsFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ description: 'Filter by CEFR level' })
  @IsOptional()
  @IsString()
  cefrLevel?: string;
}
