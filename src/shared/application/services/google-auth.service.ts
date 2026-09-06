import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { HttpClientService } from './http-client.service';

export interface GoogleAuthPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  avatar_url?: string;
  given_name: string;
  family_name: string;
}

@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;
  private clientId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService,
  ) {
    this.clientId = this.configService.getOrThrow<string>('iam.googleClientId');
    this.googleClient = new OAuth2Client(this.clientId);
  }

  async verifyIdToken(accessToken: string): Promise<GoogleAuthPayload> {
    try {
      const payload = await this.httpClientService.get<GoogleAuthPayload>(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!payload || !payload.email || !payload.sub) {
        throw new UnauthorizedException('Invalid Google credentials');
      }

      const picture = payload.picture || payload.avatar_url || '';

      return {
        sub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified,
        name: payload.name || '',
        picture,
        given_name: payload.given_name || '',
        family_name: payload.family_name || '',
      };
    } catch {
      throw new UnauthorizedException('Invalid Google credentials');
    }
  }
}
