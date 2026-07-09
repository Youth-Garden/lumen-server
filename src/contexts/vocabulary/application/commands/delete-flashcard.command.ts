export class DeleteFlashcardCommand {
  constructor(
    public readonly flashcardId: string,
    public readonly userId: string,
  ) {}
}
