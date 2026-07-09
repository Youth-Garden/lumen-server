import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitSpeechRecordDto {
  @ApiProperty({ example: 'https://example.com/user-recording.mp3' })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;
}
