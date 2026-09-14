import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AppConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { RabbitMQModule, RedisModule } from '@app/messaging';
import { AuthModule } from '@app/auth';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.forRoot(),
    RedisModule,
    RabbitMQModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
