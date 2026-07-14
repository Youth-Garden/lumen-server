import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
}

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET as string,
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '900', 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  refreshExpiresIn: parseInt(
    process.env.JWT_REFRESH_EXPIRES_IN ?? '2592000',
    10,
  ),
}));
