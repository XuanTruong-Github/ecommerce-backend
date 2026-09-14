import { AppConfigService } from '@app/config';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  connect,
  type AmqpConnectionManager,
  type ChannelWrapper,
} from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channel!: ChannelWrapper;
  private readonly logger = new Logger(RabbitMQService.name);
  constructor(private readonly config: AppConfigService) {}
  async onModuleInit() {
    const uri = this.config.rabbitmq.uri;
    const exchange = this.config.rabbitmq.exchange;
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

  async createConsumer(
    queue: string,
    routingKeys: string[],
    handler: (message: any) => Promise<void>,
  ) {
    const exchange = this.config.rabbitmq.exchange;
    const channel = this.connection.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange(exchange, 'topic', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        for (const routingKey of routingKeys) {
          await channel.bindQueue(queue, exchange, routingKey);
        }
        await channel.consume(queue, async (msg) => {
          if (!msg) return;
          try {
            const content = JSON.parse(msg.content.toString());
            await handler(content);
            channel.ack(msg);
          } catch (error) {
            this.logger.error(
              `Error consuming message from queue ${queue}`,
              error,
            );

            channel.nack(msg, false, false);
          }
        });
      },
    });
    await channel.waitForConnect();
    return channel;
  }
  async onModuleDestroy() {
    await this.connection?.close();
  }
}
