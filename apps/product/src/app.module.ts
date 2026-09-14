import { AppConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { RabbitMQModule, RedisModule } from '@app/messaging';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.forRoot(),
    RedisModule,
    RabbitMQModule,
    HealthModule,
  ],
})
export class AppModule {}
