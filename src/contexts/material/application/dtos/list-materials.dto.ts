import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../shared/presentation/dtos/pagination.dto';
import { MaterialType } from '../../domain/enums/material.enum';

export class ListMaterialsDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: MaterialType,
    description: 'Filter by material type',
  })
  @IsOptional()
  @IsEnum(MaterialType)
  type?: MaterialType;
}
