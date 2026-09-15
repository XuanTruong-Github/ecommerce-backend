import { AppConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { RabbitMQModule, RedisModule } from '@app/messaging';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ProductsService } from './products/products.service';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.forRoot(),
    RedisModule,
    RabbitMQModule,
    HealthModule,
  ],
  controllers: [],
  providers: [ProductsService],
})
export class AppModule {}
