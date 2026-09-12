import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap/setup-app';
import { setupSwagger } from './bootstrap/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);
  setupApp(app);
  setupSwagger(app);
  const logger = app.get(Logger);
  const port = config.get<number>('PORT');
  await app.listen(port, async () => {
    const appUrl = await app.getUrl();
    logger.log(`API is running at port: ${appUrl}`);
    logger.log(`Swagger UI available at: ${appUrl}/api/docs`);
    logger.log(`Better Auth doc available at: ${appUrl}/api/auth/reference`);
  });
}
bootstrap().catch((error) => {
  console.error('Bootstrap failed', error);
  process.exit(1);
});
