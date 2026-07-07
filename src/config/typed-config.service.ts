import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from './app.config';
import type { JwtConfig } from './jwt.config';
import type { DatabaseConfig } from './database.config';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

  get app(): AppConfig {
    return this.configService.getOrThrow<AppConfig>('app');
  }

  get jwt(): JwtConfig {
    return this.configService.getOrThrow<JwtConfig>('jwt');
  }

  get database(): DatabaseConfig {
    return this.configService.getOrThrow<DatabaseConfig>('database');
  }
}
