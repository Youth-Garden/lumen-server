export class GetHeatmapQuery {
  constructor(
    public readonly userId: string,
    public readonly days: number = 365,
  ) {}
}
