import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitGrammarExerciseDto {
  @ApiProperty({ example: 'go' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
