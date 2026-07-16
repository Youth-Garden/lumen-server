import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../mail/email.module';
import { MailProcessor } from './mail.processor';
import RedisMock from 'ioredis-mock';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: new RedisMock() as any,
        defaultJobOptions: {
          attempts: 2, // Limit retry attempts to save quota on Upstash Free tier
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          removeOnComplete: true,
          removeOnFail: 100,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
    EmailModule,
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
