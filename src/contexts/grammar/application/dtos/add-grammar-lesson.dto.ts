import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddGrammarLessonDto {
  @ApiProperty({ example: 'Present Simple' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The present simple is used for facts...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  orderIndex: number;
}
