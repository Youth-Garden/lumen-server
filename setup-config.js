const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, 'src/config');

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// 1. app.config.ts
fs.writeFileSync(path.join(configDir, 'app.config.ts'), 
`import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'staging' | 'production' | 'test';
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  }),
);
`);

// 2. jwt.config.ts
fs.writeFileSync(path.join(configDir, 'jwt.config.ts'),
`import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export default registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET as string,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '900', 10),
  }),
);
`);

// 3. database.config.ts
fs.writeFileSync(path.join(configDir, 'database.config.ts'),
`import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    url: process.env.DATABASE_URL as string,
  }),
);
`);

// 4. validation.schema.ts
fs.writeFileSync(path.join(configDir, 'validation.schema.ts'),
`import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.number().default(900),

  DATABASE_URL: Joi.string().required(),
});
`);

// 5. typed-config.service.ts
fs.writeFileSync(path.join(configDir, 'typed-config.service.ts'),
`import { Injectable } from '@nestjs/common';
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
`);

// 6. index.ts
fs.writeFileSync(path.join(configDir, 'index.ts'),
`export { default as appConfig } from './app.config';
export { default as jwtConfig } from './jwt.config';
export { default as databaseConfig } from './database.config';
export { validationSchema } from './validation.schema';
export { TypedConfigService } from './typed-config.service';

export type { AppConfig } from './app.config';
export type { JwtConfig } from './jwt.config';
export type { DatabaseConfig } from './database.config';
`);

console.log('Config namespace created.');
