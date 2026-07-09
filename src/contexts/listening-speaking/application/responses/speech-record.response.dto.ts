import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SpeechRecordResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  speakingTaskId: string;

  @Expose()
  audioUrl: string;

  @Expose()
  accuracyScore: number;

  @Expose()
  feedback: string;

  constructor(partial: Partial<SpeechRecordResponseDto>) {
    Object.assign(this, partial);
  }
}
