import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string, role: string): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): string {
    return uuidv4();
  }
}
