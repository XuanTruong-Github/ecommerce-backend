import { AppConfigService } from '@app/config';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  connect,
  type AmqpConnectionManager,
  type ChannelWrapper,
} from 'amqp-connection-manager';

export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channel!: ChannelWrapper;
  private readonly logger = new Logger(RabbitMQService.name);
  constructor(private readonly config: AppConfigService) {}
  async onModuleInit() {
    const uri = this.config.rabbitmq.uri;
    console.log('RabbitMQ URI:', uri);
    const exchange = this.config.rabbitmq.exchange;
    console.log('RabbitMQ Exchange:', exchange);
    this.connection = connect([uri]);
    this.connection.on('connect', () => {
      this.logger.log('RabbitMQ connected');
    });
    this.connection.on('disconnect', (err) => {
      this.logger.error('RabbitMQ disconnected', err);
    });
    this.channel = this.connection.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange(exchange, 'topic', { durable: true });
        this.logger.log('RabbitMQ channel initialized');
      },
    });
    await this.connection.connect();
  }

  get isConnected() {
    return this.connection?.isConnected() ?? false;
  }

  async publish(routingKey: string, payload: Record<string, unknown>) {
    const exchange = this.config.rabbitmq.exchange;
    await this.channel.publish(exchange, routingKey, payload, {
      persistent: true,
    });
  }
  async onModuleDestroy() {
    await this.connection?.close();
  }
}
