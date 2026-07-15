import { Module } from '@nestjs/common';
import { HashingService, HttpClientService } from './application/services';

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
