import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AppException, CommonEx } from '../../domain/exceptions';
import { EmailService } from '../mail/email.service';
import { EmailPayload } from '../mail/email.types';

@Processor('mail')
@Injectable()
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailPayload<Record<string, unknown>>>) {
    const { to, templateName } = job.data;
    this.logger.debug(`Processing mail job ${job.id}: ${templateName} → ${to}`);

    try {
      const result = await this.emailService.send(job.data);

      if (!result.success) {
        throw new AppException({
          ...CommonEx.InternalError,
          message: result.error || 'Unknown email error',
        });
      }

      this.logger.log(
        `✓ Mail job ${job.id} completed (messageId: ${result.messageId})`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `✗ Mail job ${job.id} failed`,
        (error as Error).message,
      );
      // Let BullMQ handle retries based on config
      throw error;
    }
  }
}
