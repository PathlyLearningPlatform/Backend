import { status as GrpcStatus, type ServiceError } from '@grpc/grpc-js';
import {
  type ArgumentsHost,
  Catch,
  Inject,
  type RpcExceptionFilter as NestRpcExceptionFilter
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { AppLogger } from '../modules/index.js';

@Catch(RpcException)
export class RpcExceptionFilter
  implements NestRpcExceptionFilter<RpcException> {

  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.appLogger.setContext(RpcExceptionFilter.name)
  }

  catch(exception: RpcException, host: ArgumentsHost): Observable<unknown> {
    const ctx = host.switchToRpc();
    const error = exception.getError();

    this.appLogger.error(exception);

    const grpcError =
      typeof error === 'object' && error != null
        ? error
        : ({
          code: GrpcStatus.UNKNOWN,
          message: exception.message,
          details: error.toString(),
        } as ServiceError);

    return throwError(() => grpcError);
  }
}