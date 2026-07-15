import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from '../../../../shared/application/services';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { PasswordResetTokenEntity } from '../../infrastructure/entities/password-reset-token.entity';
import { ResetPasswordCommand } from './reset-password.command';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<
  ResetPasswordCommand,
  void
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly tokenRepo: Repository<PasswordResetTokenEntity>,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const tokens = await this.tokenRepo.find();

    let validTokenEntity: PasswordResetTokenEntity | null = null;

    for (const tokenEntity of tokens) {
      if (tokenEntity.expiresAt > new Date()) {
        const isMatch = await this.hashingService.compare(
          command.token,
          tokenEntity.tokenHash,
        );
        if (isMatch) {
          validTokenEntity = tokenEntity;
          break;
        }
      }
    }

    if (!validTokenEntity) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.userRepository.findById(validTokenEntity.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await this.hashingService.hash(command.newPassword);
    user.changePassword(hashedPassword);
    await this.userRepository.save(user);

    await this.tokenRepo.delete({ userId: user.id });
  }
}
