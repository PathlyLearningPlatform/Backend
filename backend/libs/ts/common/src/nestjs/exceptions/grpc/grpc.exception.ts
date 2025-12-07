import { type ServiceError } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class GrpcException extends RpcException {
  constructor(
    statusCode: number,
    message: string,
    details: unknown,
    cause?: unknown
  ) {
    super({
      code: statusCode,
      message: message,
      details: details,
      cause: cause,
    } as ServiceError);
  }
}