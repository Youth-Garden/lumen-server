import { AggregateRoot } from '@nestjs/cqrs';

export class SpeakingTask extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly prompt: string,
    public readonly referenceAudioUrl: string | null,
    public readonly keywords: string[],
  ) {
    super();
  }

  static create(
    id: string,
    title: string,
    prompt: string,
    referenceAudioUrl: string | null,
    keywords: string[],
  ): SpeakingTask {
    return new SpeakingTask(id, title, prompt, referenceAudioUrl, keywords);
  }

  static restore(
    id: string,
    title: string,
    prompt: string,
    referenceAudioUrl: string | null,
    keywords: string[],
  ): SpeakingTask {
    return new SpeakingTask(id, title, prompt, referenceAudioUrl, keywords);
  }
}
