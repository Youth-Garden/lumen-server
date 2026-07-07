export class GetQuizByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
