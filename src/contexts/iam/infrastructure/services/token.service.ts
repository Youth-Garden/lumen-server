import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '../../domain/enums/token-type.enum';

interface TokenPayload {
  sub: string;
  role: string;
  type: TokenType;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string, role: string): string {
    const payload = { sub: userId, role, type: TokenType.ACCESS };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userId: string): string {
    const payload = { sub: userId, type: TokenType.REFRESH };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): TokenPayload {
    const payload = this.jwtService.verify<TokenPayload>(token);
    if (payload.type !== TokenType.REFRESH) {
      throw new Error('Invalid token type');
    }
    return payload;
  }
}
