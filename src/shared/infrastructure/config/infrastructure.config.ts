import { registerAs } from '@nestjs/config';

export interface InfrastructureConfig {
  redis: { url?: string };
  resend: { apiKey?: string };
  r2: {
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    endpoint?: string;
    publicUrl?: string;
  };
  cloudinary: {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
    url?: string;
  };
}

export default registerAs('infrastructure', (): InfrastructureConfig => ({
  redis: {
    url: process.env.UPSTASH_REDIS_URL,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
  r2: {
    accessKey: process.env.R2_ACCESS_KEY,
    secretKey: process.env.R2_SECRET_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    endpoint: process.env.R2_ENDPOINT,
    publicUrl: process.env.R2_PUBLIC_URL,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    url: process.env.CLOUDINARY_URL,
  },
}));
