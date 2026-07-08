export class UpdateProgressSettingsCommand {
  constructor(
    public readonly userId: string,
    public readonly dailyGoalMinutes?: number,
  ) {}
}
