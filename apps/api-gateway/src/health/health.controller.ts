import { RabbitMQService, REDIS_CLIENT } from '@app/messaging';
import { Controller, Get, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongooseConnection: Connection,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  @Get()
  async check() {
    const mongodb = this.mongooseConnection.readyState == 1 ? 'up' : 'down';
    let redis = 'down';
    try {
      await this.redis.ping();
      redis = 'up';
    } catch {
      redis = 'down';
    }
    const rabbitmq = this.rabbitmq.isConnected ? 'up' : 'down';
    const status =
      mongodb === 'up' && redis === 'up' && rabbitmq === 'up' ? 'ok' : 'error';
    return {
      status,
      services: {
        mongodb,
        redis,
        rabbitmq,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
