import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './configs/env.validation';
import { PinoLoggerModule } from './configs/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppThrottlerModule } from './configs/throttler/throttler.module';
const envFile =
  process.env.NODE_ENV === 'production'
    ? ['.env.production', '.env']
    : ['.env.development', '.env'];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      envFilePath: envFile,
    }),
    PinoLoggerModule,
    AppThrottlerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
