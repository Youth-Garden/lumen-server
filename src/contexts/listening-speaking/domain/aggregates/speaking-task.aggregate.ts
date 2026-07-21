import { AggregateRoot } from '@nestjs/cqrs';

export class SpeakingTask extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly prompt: string,
    public readonly referenceAudioUrl: string | null,
    public readonly keywords: string[],
    public readonly category: string | null = null,
  ) {
    super();
  }

  static create(
    id: string,
    title: string,
    prompt: string,
    referenceAudioUrl: string | null,
    keywords: string[],
    category: string | null = null,
  ): SpeakingTask {
    return new SpeakingTask(
      id,
      title,
      prompt,
      referenceAudioUrl,
      keywords,
      category,
    );
  }

  static restore(
    id: string,
    title: string,
    prompt: string,
    referenceAudioUrl: string | null,
    keywords: string[],
    category: string | null = null,
  ): SpeakingTask {
    return new SpeakingTask(
      id,
      title,
      prompt,
      referenceAudioUrl,
      keywords,
      category,
    );
  }
}
