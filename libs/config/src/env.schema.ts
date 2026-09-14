import { z } from 'zod';

const booleanFromString = z.preprocess((value) => {
  if (typeof value === 'string') {
    return ['1', 'true', 'yes'].includes(value.toLowerCase());
  }
  return value;
}, z.boolean());

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  APP_ENV: z
    .enum(['local', 'development', 'staging', 'production', 'test'])
    .default('local'),

  APP_NAME: z.string().default('ecommerce-backend'),
  APP_VERSION: z.string().default('1.0.0'),

  TIMEZONE: z.string().default('Asia/Ho_Chi_Minh'),
  DEFAULT_CURRENCY: z.string().default('VND'),
  DEFAULT_LOCALE: z.string().default('vi'),
  DEFAULT_STORE_ID: z.string().default('default'),

  API_GATEWAY_HOST: z.string().default('0.0.0.0'),
  API_GATEWAY_PORT: z.coerce.number().default(3000),
  API_GATEWAY_GLOBAL_PREFIX: z.string().default('api'),

  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: booleanFromString.default(true),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB: z.string().default('ecommerce'),
  MONGODB_MIN_POOL_MIN_SIZE: z.coerce.number().default(5),
  MONGODB_MAX_POOL_MAX_SIZE: z.coerce.number().default(50),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_TLS: booleanFromString.default(false),
  REDIS_KEY_PREFIX: z.string().default('ecommerce:'),

  RABBITMQ_URI: z.string().min(1, 'RABBITMQ_URI is required'),
  RABBITMQ_PREFETCH: z.coerce.number().default(10),
  RABBITMQ_EXCHANGE: z.string().default('ecommerce.events'),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),

  BETTER_AUTH_URL: z.string().url(),

  BETTER_AUTH_TRUSTED_ORIGINS: z.string().default(''),

  BETTER_AUTH_SESSION_MAX_AGE: z.coerce.number().default(604800),
  BETTER_AUTH_COOKIE_SECURE: booleanFromString.default(false),
  BETTER_AUTH_COOKIE_SAME_SITE: z
    .enum(['lax', 'strict', 'none'])
    .default('lax'),
  BETTER_AUTH_COOKIE_NAME: z.string().default('ecommerce.session'),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  LOG_PRETTY_PRINT: booleanFromString.default(false),
  SEARCH_SERVICE_HOST: z.string().default('0.0.0.0'),
  SEARCH_SERVICE_PORT: z.coerce.number().default(3002),
  SEARCH_SERVICE_URL: z.string().default('http://localhost:3002'),
  INTERNAL_API_TOKEN: z.string().default('ecommerce-api-token'),
  ELASTICSEARCH_NODE: z.string().default('http://localhost:9200'),
  ELASTICSEARCH_USERNAME: z.string().optional(),
  ELASTICSEARCH_PASSWORD: z.string().optional(),
  ELASTICSEARCH_INDEX_PREFIX: z.string().default('ecommerce_local'),
  ELASTICSEARCH_REQUEST_TIMEOUT: z.coerce.number().default(30000),

  STORAGE_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  LOCAL_STORAGE_PATH: z.string().default('./storage/uploads'),
  PUBLIC_MEDIA_URL: z.string().default('http://localhost:3000/media'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`ENV validation failed:\n${formatted}`);
  }

  return parsed.data;
}
