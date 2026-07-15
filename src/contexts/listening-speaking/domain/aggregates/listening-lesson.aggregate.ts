import { AggregateRoot } from '@nestjs/cqrs';
import { TranslationRecord } from '../../../../shared/domain/types/translation.type';

export interface TranscriptLine {
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: TranslationRecord;
}

export class ListeningLesson extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly audioUrl: string,
    public readonly cefrLevel: string,
    public readonly transcript: TranscriptLine[],
  ) {
    super();
  }

  static create(
    id: string,
    title: string,
    audioUrl: string,
    cefrLevel: string,
    transcript: TranscriptLine[],
  ): ListeningLesson {
    return new ListeningLesson(id, title, audioUrl, cefrLevel, transcript);
  }

  static restore(
    id: string,
    title: string,
    audioUrl: string,
    cefrLevel: string,
    transcript: TranscriptLine[],
  ): ListeningLesson {
    return new ListeningLesson(id, title, audioUrl, cefrLevel, transcript);
  }
}
