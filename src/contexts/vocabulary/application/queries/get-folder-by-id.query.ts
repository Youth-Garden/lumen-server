export class GetFolderByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
