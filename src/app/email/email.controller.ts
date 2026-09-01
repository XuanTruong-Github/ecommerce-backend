import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('internal/email')
export class InternalEmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('verify')
  async verifyEmail(@Body() body: { user: any; url: string; token: string }) {
    const result = await this.emailService.sendVerificationEmail(
      body.user.email,
      body.user.name,
      body.url,
    );
    if (result) throw new BadRequestException();
    return {
      success: result,
    };
  }
}
