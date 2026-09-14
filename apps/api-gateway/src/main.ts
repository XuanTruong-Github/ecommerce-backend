import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { AppConfigService } from '@app/config';
import { BETTER_AUTH } from '@app/auth';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const config = app.get(AppConfigService);
  const auth = app.get(BETTER_AUTH);
  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix(config.apiGateway.globalPrefix);
  app.enableCors({
    origin: config.corsOrigins,
    credentials: config.corsCredentials,
  });
  app.use(`/${config.apiGateway.globalPrefix}/auth`, toNodeHandler(auth));
  app.enableShutdownHooks();
  const port = config.apiGateway.port;
  await app.listen(port);
  Logger.log(`API Gateway is running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap().catch((error) => {
  Logger.error('Error during bootstrap', error, 'Bootstrap');
  process.exit(1);
});
