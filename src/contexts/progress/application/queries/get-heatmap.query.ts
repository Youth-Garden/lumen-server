export class GetHeatmapQuery {
  constructor(
    public readonly userId: string,
    public readonly year?: number,
    public readonly days: number = 365,
  ) {}
}
