import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { VerifyEmailOtpCommand } from './verify-email-otp.command';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import {
  TokenService,
  HashingService,
} from '../../../../shared/application/services';
import { RedisService } from '../../../../shared/infrastructure/redis/redis.service';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AppException } from '../../../../shared/domain/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';
import { User } from '../../domain/entities/user.entity';
import { AuthTokensResponseDto } from '../responses/auth-tokens.response.dto';

@CommandHandler(VerifyEmailOtpCommand)
export class VerifyEmailOtpHandler implements ICommandHandler<
  VerifyEmailOtpCommand,
  AuthTokensResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly hashingService: HashingService,
    private readonly redisService: RedisService,
  ) {}

  async execute(
    command: VerifyEmailOtpCommand,
  ): Promise<AuthTokensResponseDto> {
    const email = command.email.toLowerCase();
    const redis = this.redisService.getClient();

    const otpHash = await redis.get(`otp:${email}`);
    if (!otpHash) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    const isOtpValid = await this.hashingService.compare(command.otp, otpHash);
    if (!isOtpValid) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    // Single-use: delete OTP immediately after a successful match
    await redis.del(`otp:${email}`);

    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.save(
        User.create(email, AuthProvider.EMAIL, null, Role.USER, null),
      );
    }

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    // Expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userRepository.createSession(
      user.id,
      refreshToken,
      expiresAt,
      command.userAgent,
      command.ipAddress,
    );

    return new AuthTokensResponseDto(accessToken, refreshToken, user);
  }
}
