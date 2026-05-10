import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  MONGO_URI: Env.schema.string(),
  JWT_ACCESS_SECRET: Env.schema.string(),
  JWT_REFRESH_SECRET: Env.schema.string(),
  JWT_ACCESS_EXPIRATION: Env.schema.string(),
  JWT_REFRESH_EXPIRATION: Env.schema.string(),
  SMTP_HOST: Env.schema.string.optional(),
  SMTP_PORT: Env.schema.number.optional(),
  SMTP_USER: Env.schema.string.optional(),
  SMTP_PASS: Env.schema.string.optional(),
  FROM_EMAIL: Env.schema.string.optional(),
})
