import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfigService } from '@app/config';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['x-internal-token'];

    if (!token || token !== this.config.internalApiToken) {
      throw new UnauthorizedException('Invalid internal token');
    }

    return true;
  }
}
