export class SpeakingTaskCompletedEvent {
  constructor(
    public readonly aggregateId: string, // User ID
    public readonly speakingTaskId: string,
    public readonly accuracyScore: number,
  ) {}
}
