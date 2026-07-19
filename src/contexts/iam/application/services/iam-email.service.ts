import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class IamEmailService {
  private readonly logger = new Logger(IamEmailService.name);

  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendOtpEmail(
    email: string,
    name: string,
    otp: string,
    expiresInMinutes = 5,
  ): Promise<void> {
    await this.mailQueue.add(
      'send',
      {
        to: email,
        templateName: 'verify-email', // the OTP/Verify template
        subject: 'Your Lumen Verification Code',
        data: { name, verificationLink: otp, expiresInMinutes }, // We reuse verify-email template and pass OTP as link for now, ideally create otp.html
      },
      {
        jobId: `otp-${email}-${Date.now()}`,
      },
    );

    this.logger.log(`Queued OTP email for ${email}`);
  }
}
