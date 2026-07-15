import { registerAs } from '@nestjs/config';

export default registerAs('infrastructure', () => ({
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
}));
