export class GetRecentActivitiesQuery {
  constructor(
    public readonly userId: string,
    public readonly limit: number = 10,
  ) {}
}
