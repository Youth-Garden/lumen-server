import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddGrammarExerciseDto {
  @ApiProperty({ example: 'I ___ to the store every day.' })
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty({ example: ['go', 'goes', 'going', 'gone'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  options: string[];

  @ApiProperty({ example: 'go' })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @ApiProperty({ example: '"I" is first person singular, so we use "go".' })
  @IsString()
  @IsNotEmpty()
  explanation: string;
}
