import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../modules/index.js';

@Injectable()
export class RpcRequestInterceptor implements NestInterceptor {
  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.appLogger.setContext(RpcRequestInterceptor.name)
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> {
    const now = Date.now();

    this.appLogger.log(
      `incoming rpc request: ${context.getClass().name}.${context.getHandler().name}`
    );
    this.appLogger.debug('request payload: ', context.switchToRpc().getData());

    return next.handle().pipe(
      tap(() => {
        this.appLogger.log(
          `response to ${context.getClass().name}.${context.getHandler().name}, latency ${Date.now() - now}ms`
        );
      })
    );
  }
}