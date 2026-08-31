import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleLoginCommand } from './google-login.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import {
  TokenService,
  GoogleAuthService,
} from '../../../../shared/application/services';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AppException } from '../../../../shared/domain/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';

import { User } from '../../domain/entities/user.entity';
import { GoogleLoginResponseDto } from '../responses/auth-tokens.response.dto';

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
    const googleName = payload.name || null;
    const googlePicture = payload.picture || null;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Auto register with Google avatar and full name
      const newUser = User.create(
        email,
        AuthProvider.GOOGLE,
        payload.sub,
        Role.USER,
        null,
        googleName,
        googlePicture,
      );
      user = await this.userRepository.save(newUser);
    } else if (
      (googlePicture && !user.avatarUrl) ||
      (googleName && !user.fullName)
    ) {
      // Sync Google avatar/name if not set yet
      user.updateProfile(
        user.fullName || googleName || undefined,
        user.avatarUrl || googlePicture || undefined,
      );
      user = await this.userRepository.save(user);
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
