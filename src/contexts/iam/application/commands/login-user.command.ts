export class LoginUserCommand {
  constructor(
    public readonly email: string,
    public readonly passwordRaw: string,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
  ) {}
}
