import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ForgotPasswordCommand } from './forgot-password.command';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PasswordResetTokenEntity } from '../../infrastructure/entities/password-reset-token.entity';
import { HashingService } from '../../../../shared/application/services';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<
  ForgotPasswordCommand,
  void
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly tokenRepo: Repository<PasswordResetTokenEntity>,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      // Do not throw error to avoid email enumeration
      console.log(
        `Forgot password requested for non-existent email: ${command.email}`,
      );
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await this.hashingService.hash(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const tokenEntity = new PasswordResetTokenEntity();
    tokenEntity.userId = user.id;
    tokenEntity.tokenHash = tokenHash;
    tokenEntity.expiresAt = expiresAt;

    // Delete any existing tokens for this user
    await this.tokenRepo.delete({ userId: user.id });
    await this.tokenRepo.save(tokenEntity);

    console.log('====================================================');
    console.log(`[MOCK EMAIL] Password Reset Request for ${user.email}`);
    console.log(`Reset Token: ${rawToken}`);
    console.log(
      `Reset Link: http://localhost:3000/auth/reset-password?token=${rawToken}`,
    );
    console.log('====================================================');
  }
}
