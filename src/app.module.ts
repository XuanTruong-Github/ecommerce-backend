import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './configs/env.validation';
import { PinoLoggerModule } from './configs/logger.module';
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
  ],
})
export class AppModule {}
