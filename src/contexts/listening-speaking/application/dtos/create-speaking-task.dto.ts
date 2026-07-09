import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpeakingTaskDto {
  @ApiProperty({ example: 'Introduce yourself' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Please state your name, age, and hobbies.' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({ example: 'https://example.com/reference.mp3' })
  @IsOptional()
  @IsString()
  referenceAudioUrl?: string;

  @ApiProperty({ example: ['name', 'age', 'hobbies'] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}
