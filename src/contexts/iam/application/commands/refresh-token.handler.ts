import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { AppException } from '../../../../shared-kernel/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';
import { AuthTokensResponseDto } from '../responses/auth-tokens.response.dto';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<
  RefreshTokenCommand,
  AuthTokensResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthTokensResponseDto> {
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

    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    return new AuthTokensResponseDto(accessToken, newRefreshToken, user);
  }
}
