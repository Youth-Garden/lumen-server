import { ApiProperty } from '@nestjs/swagger';

export class DictationAnswerDto {
  @ApiProperty({ description: 'The ID of the transcript sentence' })
  transcriptId: string;

  @ApiProperty({ description: 'The text user typed for dictation' })
  userInput: string;
}

export class SubmitDictationDto {
  @ApiProperty({ description: 'The ID of the material being practiced' })
  materialId: string;

  @ApiProperty({
    description: 'Array of user answers for each transcript',
    type: [DictationAnswerDto],
  })
  answers: DictationAnswerDto[];
}

export class DictationItemResultDto {
  @ApiProperty({ description: 'The ID of the transcript sentence' })
  transcriptId: string;

  @ApiProperty({ description: 'The text user typed for dictation' })
  userInput: string;

  @ApiProperty({ description: 'The original transcript text' })
  correctAnswer: string;

  @ApiProperty({
    description: 'Whether the input exactly matched the transcript',
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Diff string for displaying differences',
    required: false,
  })
  diff?: string;
}

export class DictationResultDto {
  @ApiProperty({ description: 'The ID of the material' })
  materialId: string;

  @ApiProperty({ description: 'Overall similarity score (0-100)' })
  score: number;

  @ApiProperty({
    description: 'Detailed results for each transcript',
    type: [DictationItemResultDto],
  })
  results: DictationItemResultDto[];
}
