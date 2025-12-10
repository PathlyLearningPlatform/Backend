import { RpcException } from '@nestjs/microservices'

export class GrpcException extends RpcException {
  constructor(error: string | object, public readonly cause?: unknown) {
    super(error)
  }
}