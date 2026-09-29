import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListTopicsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search term for topic name' })
  @IsOptional()
  @IsString()
  search?: string;
}
