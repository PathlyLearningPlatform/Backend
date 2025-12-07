import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcException } from './grpc.exception.js';

export class GrpcNotFoundException extends GrpcException {
  constructor(message: string, details: unknown, cause?: unknown) {
    super(GrpcStatus.NOT_FOUND, message, details, cause);
  }
}