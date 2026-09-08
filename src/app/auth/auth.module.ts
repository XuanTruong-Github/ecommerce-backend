import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { DataSource } from 'typeorm';
import { createBetterAuthInstance } from 'src/configs/auth';
import { Account } from './entities/account.entity';
import { Session } from './entities/session.entity';
import { Verification } from './entities/verification.entity';
import { User } from '../user/entities/user.entity';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account, Session, Verification]),
    BetterAuthModule.forRootAsync({
      isGlobal: true,
      disableGlobalAuthGuard: true,
      imports: [EmailModule, RedisModule],
      inject: [DataSource, EmailService],
      useFactory: (dataSource: DataSource, emailService: EmailService) => {
        return {
          auth: createBetterAuthInstance({ dataSource, emailService }),
          bodyParser: {
            json: { limit: '2mb' },
            urlencoded: { limit: '2mb', extended: true },
            rawBody: true,
          },
        };
      },
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
