import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import type { DataSource } from 'typeorm';
import { v7 as uuidV7 } from 'uuid';
import type { EmailService } from 'src/app/email/email.service';
import type { Pool } from 'pg';

export interface BetterAuthOptionsContext {
  dataSource: DataSource;
  emailService: EmailService;
}

export function createBetterAuthInstance({ dataSource, emailService }: BetterAuthOptionsContext) {
  const pgPool = (dataSource.driver as any).master as Pool;

  return betterAuth({
    database: pgPool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8080',
    basePath: '/api/auth',
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        if (emailService) {
          await emailService.sendPasswordResetEmail(user.email, user.name, url);
        }
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: false,
      sendVerificationEmail: async ({ user, url }) => {
        if (emailService) {
          await emailService.sendVerificationEmail(user.email, user.name, url);
        }
      },
    },
    user: {
      modelName: 'users',
      // fields: {
      //   emailVerified: 'email_verified',
      //   createdAt: 'created_at',
      //   updatedAt: 'updated_at',
      // },
      additionalFields: {
        phone: { type: 'string', required: false },
        dateOfBirth: {
          type: 'date',
          required: false,
          fieldName: 'date_of_birth',
        },
        gender: { type: 'string', required: false, defaultValue: 'other' },
        role: { type: 'string', required: false, defaultValue: 'customer' },
      },
    },
    session: {
      modelName: 'sessions',
      // fields: {
      //   userId: 'user_id',
      //   token: 'token',
      //   expiresAt: 'expires_at',
      //   ipAddress: 'ip_address',
      //   userAgent: 'user_agent',
      //   createdAt: 'created_at',
      //   updatedAt: 'updated_at',
      // },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    account: {
      modelName: 'accounts',
      // fields: {
      //   userId: 'user_id',
      //   accountId: 'account_id',
      //   providerId: 'provider_id',
      //   accessToken: 'access_token',
      //   refreshToken: 'refresh_token',
      //   idToken: 'id_token',
      //   accessTokenExpiresAt: 'access_token_expires_at',
      //   refreshTokenExpiresAt: 'refresh_token_expires_at',
      //   scope: 'scope',
      //   password: 'password',
      //   issuer: 'issuer',
      //   createdAt: 'created_at',
      //   updatedAt: 'updated_at',
      // },
    },
    verification: {
      modelName: 'verifications',
      // fields: {
      //   identifier: 'identifier',
      //   value: 'value',
      //   expiresAt: 'expires_at',
      //   createdAt: 'created_at',
      //   updatedAt: 'updated_at',
      // },
    },
    advanced: {
      database: {
        generateId: () => uuidV7(),
      },
    },
    plugins: [openAPI()],
    trustedOrigins: ['*'],
  });
}
