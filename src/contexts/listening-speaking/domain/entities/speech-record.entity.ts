export class SpeechRecord {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly speakingTaskId: string,
    public readonly audioUrl: string,
    public readonly accuracyScore: number, // e.g. 0-100
    public readonly feedback: string,
  ) {}
}
