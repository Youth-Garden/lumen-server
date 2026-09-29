import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../shared/presentation/dtos/pagination.dto';

export class ListDueWordsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter due words by specific folder ID',
  })
  @IsOptional()
  @IsString()
  folderId?: string;

  @ApiPropertyOptional({
    description: 'Whether to include new unstudied words',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeNew?: boolean;
}
