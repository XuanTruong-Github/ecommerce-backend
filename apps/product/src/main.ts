import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from '@app/config';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.corsOrigins,
    credentials: config.corsCredentials,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product Service')
    .setDescription('Product service for ecommerce')
    .setVersion(config.appVersion)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  app.enableShutdownHooks();

  const port = config.productService.port;
  await app.listen(port);
  Logger.log(
    `Product Service is running on http://localhost:${port}`,
    'Bootstrap',
  );

  Logger.log(`Swagger docs: http://localhost:${port}/docs`, 'Bootstrap');
}
bootstrap();
