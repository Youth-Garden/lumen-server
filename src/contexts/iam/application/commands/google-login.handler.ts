import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios from 'axios';
import {
  GoogleAuthService,
  TokenService,
} from '../../../../shared/application/services';
import { AppException } from '../../../../shared/domain/exceptions';
import { StorageService } from '../../../../shared/infrastructure/storage/storage.service';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AuthEx } from '../../domain/exceptions/auth.exception';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { GoogleLoginCommand } from './google-login.command';

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
    private readonly storageService: StorageService,
  ) {}

  private async downloadAndUploadAvatar(
    googlePictureUrl: string,
    tempId: string,
  ): Promise<string> {
    try {
      const response = await axios.get<Buffer>(googlePictureUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      const buffer = Buffer.from(response.data);
      const contentType =
        (response.headers['content-type'] as string) || 'image/jpeg';
      const ext = contentType.includes('png') ? 'png' : 'jpg';
      const fileName = `avatars/google_${tempId}_${Date.now()}.${ext}`;

      const uploadedUrl = await this.storageService.uploadFile(
        buffer,
        fileName,
        contentType,
      );
      return uploadedUrl;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        'Failed to download/upload Google avatar to storage:',
        errorMessage,
      );
      return googlePictureUrl;
    }
  }

  async execute(command: GoogleLoginCommand): Promise<GoogleLoginResponseDto> {
    const payload = await this.googleAuthService.verifyIdToken(command.idToken);

    if (!payload.email) {
      throw new AppException(AuthEx.InvalidCredentials);
    }
    const email = payload.email;
    const googleName = payload.name || null;
    const rawGooglePicture = payload.picture || null;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Download Google profile picture & upload to our system storage (R2/S3)
      let storedAvatarUrl = rawGooglePicture;
      if (rawGooglePicture) {
        const cleanSub = payload.sub || 'user';
        storedAvatarUrl = await this.downloadAndUploadAvatar(
          rawGooglePicture,
          cleanSub,
        );
      }

      // Auto register with system-stored avatar and full name (first time registration only)
      const newUser = User.create(
        email,
        AuthProvider.GOOGLE,
        payload.sub,
        Role.USER,
        null,
        googleName,
        storedAvatarUrl,
      );
      user = await this.userRepository.save(newUser);
    }

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    const expiresAt = this.tokenService.getRefreshTokenExpiresAt();

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
