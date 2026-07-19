export class VerifyEmailOtpCommand {
  constructor(
    public readonly email: string,
    public readonly otp: string,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
  ) {}
}
