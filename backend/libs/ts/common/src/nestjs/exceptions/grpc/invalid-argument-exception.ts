import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcException } from './grpc.exception.js';

export class GrpcInvalidArgumentException extends GrpcException {
  constructor(message: string, details: unknown, cause?: unknown) {
    super(GrpcStatus.INVALID_ARGUMENT, message, details, cause);
  }
}