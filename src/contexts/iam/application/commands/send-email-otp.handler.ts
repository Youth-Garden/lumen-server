import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailOtpCommand } from './send-email-otp.command';
import { HashingService } from '../../../../shared/application/services';
import { RedisService } from '../../../../shared/infrastructure/redis/redis.service';
import { IamEmailService } from '../services/iam-email.service';

const OTP_TTL_SECONDS = 300; // 5 minutes

@CommandHandler(SendEmailOtpCommand)
export class SendEmailOtpHandler implements ICommandHandler<
  SendEmailOtpCommand,
  void
> {
  constructor(
    private readonly hashingService: HashingService,
    private readonly redisService: RedisService,
    private readonly iamEmailService: IamEmailService,
  ) {}

  async execute(command: SendEmailOtpCommand): Promise<void> {
    const email = command.email.toLowerCase();

    const otp = this.generateOtp();
    const otpHash = await this.hashingService.hash(otp);

    await this.redisService
      .getClient()
      .set(`otp:${email}`, otpHash, 'EX', OTP_TTL_SECONDS);

    const name = email.split('@')[0] || email;
    await this.iamEmailService.sendOtpEmail(email, name, otp);
  }

  private generateOtp(): string {
    // 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
