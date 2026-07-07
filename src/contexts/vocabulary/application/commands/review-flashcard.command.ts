export class ReviewFlashcardCommand {
  constructor(
    public readonly flashcardId: string,
    public readonly quality: number, // 0 to 5
    public readonly userId: string,
  ) {}
}
