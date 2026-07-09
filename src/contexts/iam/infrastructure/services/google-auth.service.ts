import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AppException } from '../../../../shared-kernel/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';

@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;
  private clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.getOrThrow<string>('iam.googleClientId');
    this.googleClient = new OAuth2Client(this.clientId);
  }

  async verifyIdToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new AppException(AuthEx.InvalidCredentials);
      }
      return payload;
    } catch {
      throw new AppException(AuthEx.InvalidCredentials);
    }
  }
}
