import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { HashingService } from '../../infrastructure/services/hashing.service';
import { TokenService } from '../../infrastructure/services/token.service';
import { AppException, AuthEx } from '../../../../shared-kernel/exceptions';
import { AuthTokensResponseDto } from '../dto/auth-tokens.response.dto';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<
  LoginUserCommand,
  AuthTokensResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<AuthTokensResponseDto> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    if (!user.password) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    const isPasswordValid = await this.hashingService.compare(
      command.passwordRaw,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppException(AuthEx.InvalidCredentials);
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

    return new AuthTokensResponseDto(
      accessToken,
      refreshToken,
      user.id,
      user.email,
      user.role,
    );
  }
}
