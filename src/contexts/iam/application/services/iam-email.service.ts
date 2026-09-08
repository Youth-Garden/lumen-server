import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../../../../shared/infrastructure/mail/email.service';

@Injectable()
export class IamEmailService {
  private readonly logger = new Logger(IamEmailService.name);

  constructor(private readonly emailService: EmailService) {}

  sendOtpEmail(
    email: string,
    name: string,
    otp: string,
    expiresInMinutes = 5,
  ): Promise<void> {
    // Non-blocking asynchronous email delivery via Resend
    void this.emailService
      .send({
        to: email,
        templateName: 'verify-email',
        subject: 'Your Lumen Verification Code',
        data: { name, verificationLink: otp, expiresInMinutes },
      })
      .then((result) => {
        if (result.success) {
          this.logger.log(`✓ OTP email successfully sent to ${email}`);
        } else {
          this.logger.error(
            `✗ Failed to send OTP email to ${email}: ${result.error}`,
          );
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`✗ Error sending OTP email to ${email}: ${message}`);
      });

    this.logger.log(`Dispatched async OTP email for ${email}`);
    return Promise.resolve();
  }
}
