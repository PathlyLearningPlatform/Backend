import {
  type ArgumentsHost,
  Catch,
  Inject,
  type RpcExceptionFilter as NestRpcExceptionFilter
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { AppLogger } from '../modules/index.js';
import { GrpcException } from '../exceptions/index.js';

@Catch(GrpcException)
export class GrpcExceptionFilter
  implements NestRpcExceptionFilter<RpcException> {

  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.appLogger.setContext(GrpcExceptionFilter.name)
  }

  catch(exception: GrpcException, host: ArgumentsHost): Observable<unknown> {
    const ctx = host.switchToRpc();

    this.appLogger.error(exception);

    const errObj = exception.getError();

    return throwError(() => errObj);
  }
}