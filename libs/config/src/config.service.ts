import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}
  get nodeEnv() {
    return this.config.get('NODE_ENV', { infer: true });
  }
  get appEnv() {
    return this.config.get('APP_ENV', { infer: true });
  }
  get isProduction() {
    return this.appEnv === 'production';
  }

  get isDevelopment() {
    return this.appEnv === 'development' || this.appEnv === 'local';
  }
  get appName() {
    return this.config.get('APP_NAME', { infer: true });
  }
  get appVersion() {
    return this.config.get('APP_VERSION', { infer: true });
  }
  get timezone() {
    return this.config.get('TIMEZONE', { infer: true });
  }
  get defaultCurrency() {
    return this.config.get('DEFAULT_CURRENCY', { infer: true });
  }
  get defaultLocale() {
    return this.config.get('DEFAULT_LOCALE', { infer: true });
  }
  get apiGateway() {
    return {
      host: this.config.get('API_GATEWAY_HOST', { infer: true }),
      port: this.config.get('API_GATEWAY_PORT', { infer: true }),
      globalPrefix: this.config.get('API_GATEWAY_GLOBAL_PREFIX', {
        infer: true,
      }),
    };
  }

  get corsOrigins() {
    return this.config
      .get('CORS_ORIGINS', { infer: true })
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  get corsCredentials() {
    return this.config.get('CORS_CREDENTIALS', { infer: true });
  }

  get mongodb() {
    return {
      uri: this.config.get('MONGODB_URI', { infer: true }),
      db: this.config.get('MONGODB_DB', { infer: true }),
      minPoolSize: this.config.get('MONGODB_MIN_POOL_MIN_SIZE', {
        infer: true,
      }),
      maxPoolSize: this.config.get('MONGODB_MAX_POOL_MAX_SIZE', {
        infer: true,
      }),
    };
  }

  get redis() {
    return {
      host: this.config.get('REDIS_HOST', { infer: true }),
      port: this.config.get('REDIS_PORT', { infer: true }),
      password: this.config.get('REDIS_PASSWORD', { infer: true }),
      db: this.config.get('REDIS_DB', { infer: true }),
      tls: this.config.get('REDIS_TLS', { infer: true }),
      keyPrefix: this.config.get('REDIS_KEY_PREFIX', { infer: true }),
    };
  }

  get rabbitmq() {
    return {
      uri: this.config.get('RABBITMQ_URI', { infer: true }),
      prefetch: this.config.get('RABBITMQ_PREFETCH', { infer: true }),
      exchange: this.config.get('RABBITMQ_EXCHANGE', { infer: true }),
    };
  }

  get betterAuth() {
    return {
      secret: this.config.get('BETTER_AUTH_SECRET', { infer: true }),
      url: this.config.get('BETTER_AUTH_URL', { infer: true }),
      trustedOrigins: this.config
        .get('BETTER_AUTH_TRUSTED_ORIGINS', { infer: true })
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
      sessionMaxAge: this.config.get('BETTER_AUTH_SESSION_MAX_AGE', {
        infer: true,
      }),
      cookieSecure: this.config.get('BETTER_AUTH_COOKIE_SECURE', {
        infer: true,
      }),
      cookieSameSite: this.config.get('BETTER_AUTH_COOKIE_SAME_SITE', {
        infer: true,
      }),
      cookieName: this.config.get('BETTER_AUTH_COOKIE_NAME', {
        infer: true,
      }),
    };
  }

  get logLevel() {
    return this.config.get('LOG_LEVEL', { infer: true });
  }

  get logPrettyPrint() {
    return this.config.get('LOG_PRETTY_PRINT', { infer: true });
  }
}
