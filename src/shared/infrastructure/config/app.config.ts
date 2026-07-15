import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'staging' | 'production' | 'test';
  cookieSecret: string;
  frontendUrl: string;
}

export default registerAs('app', (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  cookieSecret: process.env.COOKIE_SECRET || 'my-cookie-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
}));
