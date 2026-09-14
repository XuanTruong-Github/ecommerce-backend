import { AppConfigModule, AppConfigService } from '@app/config';
import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return new Redis({
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
          db: config.redis.db,
          tls: config.redis.tls,
          keyPrefix: config.redis.keyPrefix,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
