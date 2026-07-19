import { Module } from '@nestjs/common';
import { HashingService, HttpClientService } from './application/services';
import { RedisService } from './infrastructure/redis/redis.service';

/**
 * CommonModule provides domain-agnostic, reusable technical utilities:
 * - HttpClientService: wrapped axios for external HTTP calls
 * - HashingService: bcrypt password hashing
 * - RedisService: shared ioredis client for caches / OTP storage
 *
 * Guards/strategies (JwtAuthGuard, JwtStrategy) remain in shared-kernel
 * because they depend on Passport/JWT config which is IAM-scoped.
 */
@Module({
  providers: [HttpClientService, HashingService, RedisService],
  exports: [HttpClientService, HashingService, RedisService],
})
export class CommonModule {}
