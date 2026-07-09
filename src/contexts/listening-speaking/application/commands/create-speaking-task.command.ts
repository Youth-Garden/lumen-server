export class CreateSpeakingTaskCommand {
  constructor(
    public readonly title: string,
    public readonly prompt: string,
    public readonly referenceAudioUrl: string | null,
    public readonly keywords: string[],
  ) {}
}
