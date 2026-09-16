export class ListFolderFlashcardsQuery {
  constructor(
    public readonly folderId: string,
    public readonly userId: string,
    public readonly topic?: string,
    public readonly page: number = 1,
    public readonly limit: number = 50,
  ) {}
}
