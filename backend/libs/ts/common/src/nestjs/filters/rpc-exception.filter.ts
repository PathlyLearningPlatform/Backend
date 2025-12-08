import { status as GrpcStatus } from '@grpc/grpc-js';
import {
  type ArgumentsHost,
  Catch,
  Inject,
  type RpcExceptionFilter as NestRpcExceptionFilter
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { GrpcErrorDto } from '../../dtos/grpc-error.dto.js';
import { AppLogger } from '../modules/index.js';

@Catch(RpcException)
export class RpcExceptionFilter
  implements NestRpcExceptionFilter<RpcException> {

  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.appLogger.setContext(RpcExceptionFilter.name)
  }

  catch(exception: RpcException, host: ArgumentsHost): Observable<unknown> {
    const ctx = host.switchToRpc();

    this.appLogger.error(exception);

    let errRes: GrpcErrorDto;
    const errObj = exception.getError();

    if (typeof errObj === 'string') {
      errRes = new GrpcErrorDto(errObj, GrpcStatus.UNKNOWN)
    } else if (errObj instanceof GrpcErrorDto) {
      errRes = errObj;
    } else {
      errRes = new GrpcErrorDto(exception.message, GrpcStatus.UNKNOWN)
    }

    return throwError(() => errRes);
  }
}