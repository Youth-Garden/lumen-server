import { LeaderboardPeriodEnum } from '../../domain/enums/progress.enum';

export class GetLeaderboardQuery {
  constructor(
    public readonly limit: number = 50,
    public readonly period: LeaderboardPeriodEnum = LeaderboardPeriodEnum.ALL_TIME,
    public readonly userId?: string,
  ) {}
}
