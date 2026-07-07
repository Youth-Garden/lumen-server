export class GetDeckByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
