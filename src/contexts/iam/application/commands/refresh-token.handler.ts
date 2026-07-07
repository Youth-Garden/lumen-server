import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { AppException, AuthEx } from '../../../../shared-kernel/exceptions';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const session = await this.userRepository.findSessionByRefreshToken(
      command.refreshToken,
    );

    if (!session) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    if (session.expiresAt < new Date()) {
      await this.userRepository.revokeSession(command.refreshToken);
      throw new AppException(AuthEx.InvalidCredentials);
    }

    const accessToken = this.tokenService.generateAccessToken(
      session.userId,
      session.role,
    );
    const newRefreshToken = this.tokenService.generateRefreshToken(
      session.userId,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userRepository.revokeSession(command.refreshToken);
    await this.userRepository.createSession(
      session.userId,
      newRefreshToken,
      expiresAt,
      command.userAgent,
      command.ipAddress,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
