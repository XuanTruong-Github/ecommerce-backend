import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
import { REQUEST_ID } from 'src/common/middlewares/request-id.middleware';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configs: ConfigService) {
        const isDev = configs.get('NODE_ENV') === 'development';
        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
            genReqId: (req, res) => {
              const existing = req.headers[REQUEST_ID];
              const id = existing ?? randomUUID();
              req.headers[REQUEST_ID] = id;
              res.setHeader(REQUEST_ID, id);
              return id;
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookies',
                'req.body.password',
                'req.headers["set-cookie"]',
              ],
              censor: '[REDACTED]',
            },
            customProps: (req: IncomingMessage) => ({
              userId: (req as IncomingMessage & { user?: { id: string } })?.user?.id,
            }),
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class PinoLoggerModule {}
