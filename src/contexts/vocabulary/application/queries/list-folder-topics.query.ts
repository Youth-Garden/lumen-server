export class ListFolderTopicsQuery {
  constructor(
    public readonly folderId: string,
    public readonly userId: string,
  ) {}
}
