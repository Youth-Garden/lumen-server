export class CreateFolderCommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly authorId: string,
  ) {}
}
