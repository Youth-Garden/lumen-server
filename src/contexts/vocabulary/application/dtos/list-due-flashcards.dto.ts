import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListDueFlashcardsDto {
  @ApiPropertyOptional({
    description: 'Filter due flashcards by specific folder ID',
  })
  @IsOptional()
  @IsString()
  @Transform(
    ({ value, obj }: { value?: unknown; obj?: Record<string, unknown> }) => {
      const rawFolderId = typeof value === 'string' ? value : undefined;
      const bracketFolderId =
        typeof obj?.['params[folderId]'] === 'string'
          ? obj['params[folderId]']
          : undefined;
      const nestedParams =
        typeof obj?.params === 'object' && obj?.params !== null
          ? (obj.params as Record<string, unknown>)
          : undefined;
      const nestedFolderId =
        typeof nestedParams?.folderId === 'string'
          ? nestedParams.folderId
          : undefined;
      return rawFolderId || bracketFolderId || nestedFolderId || undefined;
    },
  )
  folderId?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of due flashcards to return',
    example: 30,
  })
  @IsOptional()
  @Transform(
    ({ value, obj }: { value?: unknown; obj?: Record<string, unknown> }) => {
      const nestedParams =
        typeof obj?.params === 'object' && obj?.params !== null
          ? (obj.params as Record<string, unknown>)
          : undefined;
      const rawVal = value ?? obj?.['params[limit]'] ?? nestedParams?.limit;
      return rawVal !== undefined && rawVal !== null
        ? Number(rawVal)
        : undefined;
    },
  )
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Whether to include new unstudied flashcards',
    example: false,
  })
  @IsOptional()
  @Transform(
    ({ value, obj }: { value?: unknown; obj?: Record<string, unknown> }) => {
      const nestedParams =
        typeof obj?.params === 'object' && obj?.params !== null
          ? (obj.params as Record<string, unknown>)
          : undefined;
      const rawVal =
        value ?? obj?.['params[includeNew]'] ?? nestedParams?.includeNew;
      return rawVal === 'true' || rawVal === true;
    },
  )
  @IsBoolean()
  includeNew?: boolean;
}
