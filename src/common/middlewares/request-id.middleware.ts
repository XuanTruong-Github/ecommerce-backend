import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
export const REQUEST_ID = 'x-request-id';
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: NextFunction) => void) {
    const existing = req.headers[REQUEST_ID];
    const requestId = existing ?? randomUUID();
    req.headers[REQUEST_ID] = requestId;
    res.setHeader(REQUEST_ID, requestId);
    next();
  }
}
