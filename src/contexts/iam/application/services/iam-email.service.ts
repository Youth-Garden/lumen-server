import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IamEmailService {
  private readonly logger = new Logger(IamEmailService.name);

  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;
    const expiresInMinutes = 15; // Should ideally match token TTL

    await this.mailQueue.add(
      'send',
      {
        to: email,
        templateName: 'reset-password',
        subject: 'Reset Your Lumen Password',
        data: { name, resetLink, expiresInMinutes },
      },
      {
        jobId: `reset-password-${email}-${Date.now()}`,
      },
    );

    this.logger.log(`Queued password reset email for ${email}`);
  }

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
