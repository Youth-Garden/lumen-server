import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleLoginCommand } from './google-login.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AppException, AuthEx } from '../../../../shared-kernel/exceptions';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  private googleClient: OAuth2Client;
  private clientId: string;

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    // Assuming GOOGLE_CLIENT_ID is added to config
    this.clientId = this.configService.getOrThrow<string>('iam.googleClientId');
    this.googleClient = new OAuth2Client(this.clientId);
  }

  async execute(command: GoogleLoginCommand): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; role: string };
  }> {
    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: command.idToken,
        audience: this.clientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    if (!payload || !payload.email) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    const email = payload.email;
    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Auto register
      user = await this.userRepository.save({
        email: email,
        password: null,
        authProvider: AuthProvider.GOOGLE,
        providerId: payload.sub,
        role: Role.USER,
        planId: null,
      });
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

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
