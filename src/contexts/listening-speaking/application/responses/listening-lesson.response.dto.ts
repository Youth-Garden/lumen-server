import { Exclude, Expose } from 'class-transformer';

export class TranscriptLineResponseDto {
  @Expose()
  startTime: number;

  @Expose()
  endTime: number;

  @Expose()
  text: string;
}

@Exclude()
export class ListeningLessonResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  audioUrl: string;

  @Expose()
  cefrLevel: string;

  @Expose()
  transcript: TranscriptLineResponseDto[];

  constructor(partial: Partial<ListeningLessonResponseDto>) {
    Object.assign(this, partial);
  }
}
