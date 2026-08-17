import { HttpStatus } from '@nestjs/common';

export type ApiErrorPayload = {
  success: false;
  statusCode: number;
  message: string;
  requestId: string;
  timestamp: string;
  path: string;
  error?: string;
};
export type ApiErrorContext = {
  requestId: string;
  path: string;
};

export function buildApiErrorPayload(
  statusCode: number,
  message: string | string[],
  error: string | undefined,
  context: ApiErrorContext,
): ApiErrorPayload {
  return {
    success: false,
    statusCode,
    message: formatClientErrorMessage(message),
    requestId: context.requestId,
    timestamp: new Date().toISOString(),
    path: context.path,
    error: error ?? '',
  };
}

function formatClientErrorMessage(message: string | string[]) {
  if (Array.isArray(message)) {
    return message.map(String).filter(Boolean).join(', ');
  }
  return message;
}

// Extract error and message from error response
type NestHttpErrorBody = {
  message: string | string[];
  error?: string;
  statusCode?: number;
};

export function extractFromHttpExceptionBody(
  body: Record<string, unknown> | NestHttpErrorBody,
  fallbackMessage: string,
) {
  const _body = body as NestHttpErrorBody;
  const message = _body.message !== undefined ? _body.message : fallbackMessage;
  const error = typeof _body.error === 'string' && _body.error !== '' ? _body.error : undefined;
  return {
    message,
    error,
  };
}

// Unknown exception

export function payloadFromUnknownException(exception: unknown, context: ApiErrorContext) {
  const isProduction = process.env.NODE_ENV === 'production';
  if (exception instanceof Error) {
    return buildApiErrorPayload(
      HttpStatus.INTERNAL_SERVER_ERROR,
      isProduction ? 'Internal server error' : exception.message,
      'Internal server error',
      context,
    );
  }
  return buildApiErrorPayload(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal server error',
    'Internal server error',
    context,
  );
}
