export class CreateFlashcardCommand {
  constructor(
    public readonly folderId: string,
    public readonly wordId: string,
  ) {}
}
