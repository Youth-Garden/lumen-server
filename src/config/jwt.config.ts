import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET as string,
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '900', 10),
}));
