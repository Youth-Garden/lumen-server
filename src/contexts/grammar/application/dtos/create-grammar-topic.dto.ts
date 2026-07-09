import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGrammarTopicDto {
  @ApiProperty({ example: 'Present Tenses' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn how to use present simple and continuous.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'A1' })
  @IsString()
  @IsNotEmpty()
  cefrLevel: string;
}
