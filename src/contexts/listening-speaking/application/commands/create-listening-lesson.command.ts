import { TranscriptLineDto } from '../dtos/create-listening-lesson.dto';

export class CreateListeningLessonCommand {
  constructor(
    public readonly title: string,
    public readonly audioUrl: string,
    public readonly cefrLevel: string,
    public readonly transcript: TranscriptLineDto[],
  ) {}
}
