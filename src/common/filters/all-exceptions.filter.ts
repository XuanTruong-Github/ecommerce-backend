import { ArgumentsHost, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import {
  buildApiErrorPayload,
  extractFromHttpExceptionBody,
  payloadFromUnknownException,
} from 'src/shared/helpers/api-error-response';
import { REQUEST_ID } from 'src/common/middlewares/request-id.middleware';

@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(AllExceptionFilter.name);
  }
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() != 'http') return;
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const context = {
      requestId: (request.headers[REQUEST_ID] as string) ?? '',
      path: request.url,
    };

    // Http exceptions
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const rawErrorResponse = exception.getResponse();
      if (typeof rawErrorResponse === 'string') {
        // Build error payload
        response
          .status(statusCode)
          .json(buildApiErrorPayload(statusCode, rawErrorResponse, undefined, context));
        return;
      }
      // Extract error from body
      const { message, error } = extractFromHttpExceptionBody(
        rawErrorResponse as Record<string, unknown>,
        exception.name,
      );
      response.status(statusCode).json(buildApiErrorPayload(statusCode, message, error, context));
      return;
    }

    // Unknown exceptions
    this.logger.error({
      msg: 'unhandled.exception',
      requestId: context.requestId,
      path: context.path,
      error: exception instanceof Error ? exception.message : 'Unknown exception',
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // build error payload for unknown exception
    const payload = payloadFromUnknownException(exception, context);
    response.status(payload.statusCode).json(payload);
    return;
  }
}
