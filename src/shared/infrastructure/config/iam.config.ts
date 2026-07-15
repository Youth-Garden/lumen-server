import { registerAs } from '@nestjs/config';

export interface IamConfig {
  googleClientId: string;
}

export default registerAs('iam', (): IamConfig => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
}));
