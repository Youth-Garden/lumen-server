import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  COOKIE_SECRET: Joi.string().required(),
  FRONTEND_URL: Joi.string().uri().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.number().default(900),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.number().default(2592000),

  DATABASE_URL: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),

  UPSTASH_REDIS_URL: Joi.string().uri().required(),
  RESEND_API_KEY: Joi.string().required(),

  R2_ACCESS_KEY: Joi.string().required(),
  R2_SECRET_KEY: Joi.string().required(),
  R2_BUCKET_NAME: Joi.string().required(),
  R2_ENDPOINT: Joi.string().uri().required(),
  R2_PUBLIC_URL: Joi.string().uri().required(),
});
