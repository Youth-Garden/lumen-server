import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenType } from '../../constants/enums';
import { AppException, CommonEx } from '../../domain/exceptions';
import type { TokenPayload } from '../../domain/interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: string, role: string): string {
    const payload = { sub: userId, role, type: TokenType.ACCESS };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userId: string): string {
    const payload = { sub: userId, type: TokenType.REFRESH };
    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');
    const refreshExpiresIn = this.configService.getOrThrow<number>(
      'jwt.refreshExpiresIn',
    );

    return this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');
    const payload = this.jwtService.verify<TokenPayload>(token, {
      secret: refreshSecret,
    });

    if (payload.type !== TokenType.REFRESH) {
      throw new AppException({
        ...CommonEx.Unauthorized,
        message: 'Invalid token type',
      });
    }
    return payload;
  }
}
