import { ApiProperty } from '@nestjs/swagger';

export class SubmitDictationDto {
  @ApiProperty({ description: 'The ID of the transcript sentence' })
  transcriptId: string;

  @ApiProperty({ description: 'The text user typed for dictation' })
  userInput: string;
}

export class DictationResultDto {
  @ApiProperty({
    description: 'Whether the input exactly matched the transcript',
  })
  isCorrect: boolean;

  @ApiProperty({ description: 'The original transcript text' })
  originalText: string;

  @ApiProperty({ description: 'Similarity score (0-100)' })
  score: number;
}
