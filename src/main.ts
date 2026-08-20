import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupApp } from './bootstrap/setup-app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);
  setupApp(app);
  const logger = app.get(Logger);
  const port = config.get<number>('PORT');
  await app.listen(port, () => {
    logger.log(`API is running at port: ${port}`);
  });
}
bootstrap().catch((error) => {
  console.error('Bootstrap failed', error);
  process.exit(1);
});
