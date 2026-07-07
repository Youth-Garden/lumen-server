export class GoogleLoginCommand {
  constructor(
    public readonly idToken: string,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
  ) {}
}
