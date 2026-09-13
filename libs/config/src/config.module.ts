import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './env.schema';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  imports: [ConfigModule.forRoot({
    isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
  })]
})
export class AppConfigModule {}
