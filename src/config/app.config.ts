import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'staging' | 'production' | 'test';
}

export default registerAs('app', (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
}));
