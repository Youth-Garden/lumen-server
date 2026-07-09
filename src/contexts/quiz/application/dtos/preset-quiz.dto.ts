import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePresetQuizDto {
  @ApiProperty({ description: 'Title of the quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the quiz' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Whether the quiz is published and visible to users',
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdatePresetQuizDto {
  @ApiPropertyOptional({ description: 'Title of the quiz' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the quiz' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the quiz is published and visible to users',
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
