import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis(
      this.configService.getOrThrow<string>('infrastructure.redis.url'),
      { maxRetriesPerRequest: null },
    );
  }

  getClient(): Redis {
    return this.client;
  }
}
