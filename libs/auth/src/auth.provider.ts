import { Provider } from '@nestjs/common';
import { BETTER_AUTH } from './auth.constants';
import { AppConfigService } from '@app/config';
import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

export const betterAuthProvider: Provider = {
  provide: BETTER_AUTH,
  inject: [AppConfigService],
  useFactory: async (config: AppConfigService) => {
    const client = new MongoClient(config.mongodb.uri);
    await client.connect();
    const db = client.db(config.mongodb.db);
    const auth = betterAuth({
      baseURL: config.betterAuth.url,
      secret: config.betterAuth.secret,
      trustedOrigins: config.betterAuth.trustedOrigins,
      database: mongodbAdapter(db),
      emailAndPassword: {
        enabled: true,
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60,
        },
      },
      advanced: {
        cookiePrefix: 'ecommerce.auth',
      },
    });
    return auth;
  },
};
