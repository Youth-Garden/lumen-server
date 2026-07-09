export class SubmitSpeechRecordCommand {
  constructor(
    public readonly speakingTaskId: string,
    public readonly userId: string,
    public readonly audioUrl: string,
  ) {}
}
