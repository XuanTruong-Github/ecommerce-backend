import { Module } from '@nestjs/common';
import { betterAuthProvider } from './auth.provider';
import { BETTER_AUTH } from './auth.constants';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [AppConfigModule],
  providers: [betterAuthProvider],
  exports: [BETTER_AUTH],
})
export class AuthModule {}
