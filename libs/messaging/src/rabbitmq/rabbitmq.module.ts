import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { AppConfigModule } from '@app/config';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
