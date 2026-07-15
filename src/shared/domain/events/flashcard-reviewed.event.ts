export class FlashcardReviewedEvent {
  constructor(
    public readonly userId: string,
    public readonly flashcardId: string,
    public readonly quality: number, // e.g. SM-2 grade (0-5)
  ) {}
}
