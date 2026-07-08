import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleLoginCommand } from './google-login.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AppException, AuthEx } from '../../../../shared-kernel/exceptions';
import { GoogleAuthService } from '../../infrastructure/services/google-auth.service';
import { User } from '../../domain/entities/user.entity';
import { GoogleLoginResponseDto } from '../dtos/auth-tokens.response.dto';

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<
  GoogleLoginCommand,
  GoogleLoginResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async execute(command: GoogleLoginCommand): Promise<GoogleLoginResponseDto> {
    const payload = await this.googleAuthService.verifyIdToken(command.idToken);

    if (!payload.email) {
      throw new AppException(AuthEx.InvalidCredentials);
    }
    const email = payload.email;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Auto register
      const newUser = User.create(
        email,
        null,
        AuthProvider.GOOGLE,
        payload.sub,
        Role.USER,
        null,
      );
      user = await this.userRepository.save(newUser);
    }

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userRepository.createSession(
      user.id,
      refreshToken,
      expiresAt,
      command.userAgent,
      command.ipAddress,
    );

    return new GoogleLoginResponseDto(accessToken, refreshToken, user);
  }
}
