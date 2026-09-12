import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
export function setupApp(app: NestExpressApplication) {
  app.use(cookieParser());
  app.useStaticAssets(join(process.cwd(), 'upload'), {
    prefix: '/upload/',
  });
  // Cho phép ALL origins (không cố định) nhưng vẫn hỗ trợ credentials.
  // Lưu ý: với credentials:true không thể dùng "*" -> phải reflect Origin.
  // origin:true = tự động reflect request Origin (cors lib).
  // Nếu cần whitelist lại, đổi thành mảng hoặc env CORS_ORIGINS.
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Request-Id',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Set-Cookie', 'Content-Disposition'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableShutdownHooks();
}
