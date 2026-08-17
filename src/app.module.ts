import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './configs/env.validation';
import { PinoLoggerModule } from './configs/logger.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppThrottlerModule } from './configs/throttler/throttler.module';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { AllExceptionFilter } from './common/filters/all-exceptions.filter';
import appConfig from './configs/app/app.config';
import throttlerConfig from './configs/throttler/throttler.config';
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
      load: [appConfig, throttlerConfig],
    }),
    PinoLoggerModule,
    AppThrottlerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
