/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { EmailModule } from '../mail/email.module';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: new Redis(
          configService.get<string>('infrastructure.redis.url')!,
          { maxRetriesPerRequest: null },
        ) as any,
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
