import { z } from 'zod';
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging']),
  PORT: z.coerce.number().default(8080),
  DB_HOST: z.string().default('localhost'),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_DATABASE: z.string().default('ecommerce_db'),
  DB_PORT: z.coerce.number().default(5432),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default('password'),
});
export type Env = z.infer<typeof envSchema>;
export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `- ${i.path.join('.')} : ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return parsed.data;
}
