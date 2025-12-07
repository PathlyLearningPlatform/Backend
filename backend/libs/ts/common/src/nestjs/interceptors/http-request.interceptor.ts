import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../modules/index.js';

@Injectable()
export class HttpRequestInterceptor implements NestInterceptor {
  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.appLogger.setContext(HttpRequestInterceptor.name)
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const now = Date.now();

    if (req.path === '/healthcheck') {
      return next.handle();
    }

    this.appLogger.log(
      `incoming request: [HTTP ${req.method}] ${req.path}`
    );
    this.appLogger.debug('request body: ', req.body);

    return next.handle().pipe(
      tap(() => {
        this.appLogger.log(
          `response: [HTTP ${req.method}] ${res.statusCode} ${req.path} (latency: ${Date.now() - now}ms)`
        );
      })
    );
  }
}