import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Inject
} from '@nestjs/common';

import { type Request, type Response } from 'express';
import { AppLogger } from '../modules/index.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.appLogger.setContext(HttpExceptionFilter.name)
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = `[HTTP ${request.method}] ${exception.getStatus()} ${request.path} - ${exception.message}`;

    if (status >= 400 && status < 500) {
      this.appLogger.warn(message);
    } else {
      this.appLogger.error(message);
      this.appLogger.debug(exception.cause);
    }

    response
      .status(status)
      .json({
        message: exception.message,
        timestamp: new Date().toISOString()
      });
  }
}