import { ApiProperty } from '@nestjs/swagger';

export class MissingExplanationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  questionNumber: number;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  part: number;

  @ApiProperty()
  testTitle: string;

  @ApiProperty()
  testId: string;
}
