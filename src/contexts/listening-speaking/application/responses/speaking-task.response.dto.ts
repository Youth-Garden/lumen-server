import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SpeakingTaskResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  prompt: string;

  @Expose()
  referenceAudioUrl: string | null;

  @Expose()
  keywords: string[];

  constructor(partial: Partial<SpeakingTaskResponseDto>) {
    Object.assign(this, partial);
  }
}
