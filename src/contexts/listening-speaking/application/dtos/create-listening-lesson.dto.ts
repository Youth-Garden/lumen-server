import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TranscriptLineDto {
  @ApiProperty({ example: 0.5 })
  @IsNumber()
  startTime: number;

  @ApiProperty({ example: 4.2 })
  @IsNumber()
  endTime: number;

  @ApiProperty({ example: 'Hello, welcome to Lumen.' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreateListeningLessonDto {
  @ApiProperty({ example: 'Basic Greetings' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/audio.mp3' })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @ApiProperty({ example: 'A1' })
  @IsString()
  @IsNotEmpty()
  cefrLevel: string;

  @ApiProperty({ type: [TranscriptLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptLineDto)
  transcript: TranscriptLineDto[];
}
