import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { THROTTLER_CONFIG } from './throttler.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configs: ConfigService) {
        const cfg = configs.getOrThrow<{ ttl: number; limit: number }>(THROTTLER_CONFIG);
        return {
          throttlers: [
            {
              name: 'default',
              ttl: cfg.ttl,
              limit: cfg.limit,
            },
          ],
        };
      },
    }),
  ],
  exports: [ThrottlerModule],
})
export class AppThrottlerModule {}
