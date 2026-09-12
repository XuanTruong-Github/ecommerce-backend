import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './app/address/address.module';
import { AuthModule } from './app/auth/auth.module';
import { CategoryModule } from './app/category/category.module';
import { CouponModule } from './app/coupon/coupon.module';
import { EmailModule } from './app/email/email.module';
import { ProductModule } from './app/product/product.module';
import { UploadModule } from './app/upload/upload.module';
import { UserModule } from './app/user/user.module';
import { AllExceptionFilter } from './common/filters/all-exceptions.filter';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { allConfigs } from './configs/configurations';
import { TypeOrmConfigService } from './configs/database/typeorm-config.service';
import { validateEnv } from './configs/env.validation';
import { PinoLoggerModule } from './configs/logger.module';
import { RedisModule } from './configs/redis/redis.module';
import { RedisService } from './configs/redis/redis.service';
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
      load: allConfigs,
    }),
    PinoLoggerModule,
    AppThrottlerModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    AddressModule,
    CategoryModule,
    ProductModule,
    EmailModule,
    RedisModule,
    CouponModule,
    UploadModule,
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
    RedisService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
