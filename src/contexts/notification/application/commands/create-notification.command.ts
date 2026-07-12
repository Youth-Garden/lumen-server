export class CreateNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
