export class ListDueFlashcardsQuery {
  constructor(
    public readonly userId: string,
    public readonly folderId?: string,
    public readonly limit?: number,
    public readonly includeNew?: boolean,
  ) {}
}
