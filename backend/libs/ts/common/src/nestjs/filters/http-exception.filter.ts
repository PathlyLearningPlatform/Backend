import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Inject
} from '@nestjs/common';

import { type Request, type Response } from 'express';
import { HttpErrorDto } from '../../dtos/http-error.dto.js';
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

    let errRes: HttpErrorDto;
    const errObj = exception.getResponse();

    if (typeof errObj === 'string') {
      errRes = new HttpErrorDto(errObj, null)
    } else if (errObj instanceof HttpErrorDto) {
      errRes = errObj;
    } else {
      errRes = new HttpErrorDto(exception.message, null)
    }

    errRes.setTimestamp();

    response
      .status(status)
      .json(errRes);
  }
}