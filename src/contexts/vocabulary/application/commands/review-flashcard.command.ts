export class ReviewFlashcardCommand {
  constructor(
    public readonly flashcardId: string,
    public readonly isCorrect: boolean,
    public readonly isFastTrackKnown: boolean | undefined,
    public readonly isFastTrackTempMemory: boolean | undefined,
    public readonly userId: string,
  ) {}
}
