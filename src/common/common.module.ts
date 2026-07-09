import { Module } from '@nestjs/common';
import { HttpClientService } from './http/http-client.service';
import { HashingService } from './crypto/hashing.service';

/**
 * CommonModule provides domain-agnostic, reusable technical utilities:
 * - HttpClientService: wrapped axios for external HTTP calls
 * - HashingService: bcrypt password hashing
 *
 * Guards/strategies (JwtAuthGuard, JwtStrategy) remain in shared-kernel
 * because they depend on Passport/JWT config which is IAM-scoped.
 */
@Module({
  providers: [HttpClientService, HashingService],
  exports: [HttpClientService, HashingService],
})
export class CommonModule {}
