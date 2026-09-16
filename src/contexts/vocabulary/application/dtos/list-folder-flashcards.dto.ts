import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListFolderFlashcardsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by topic name' })
  @IsOptional()
  @IsString()
  topic?: string;
}
