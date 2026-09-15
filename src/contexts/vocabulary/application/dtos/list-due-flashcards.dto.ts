import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListDueFlashcardsDto {
  @ApiPropertyOptional({
    description: 'Filter due flashcards by specific folder ID',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => {
    return value || obj?.['params[folderId]'] || obj?.params?.folderId || undefined;
  })
  folderId?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of due flashcards to return',
    example: 30,
  })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const rawVal = value ?? obj?.['params[limit]'] ?? obj?.params?.limit;
    return rawVal !== undefined && rawVal !== null ? Number(rawVal) : undefined;
  })
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Whether to include new unstudied flashcards',
    example: false,
  })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const rawVal = value ?? obj?.['params[includeNew]'] ?? obj?.params?.includeNew;
    return rawVal === 'true' || rawVal === true;
  })
  @IsBoolean()
  includeNew?: boolean;
}
