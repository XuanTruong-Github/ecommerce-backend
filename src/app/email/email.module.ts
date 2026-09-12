import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InternalEmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  controllers: [InternalEmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
