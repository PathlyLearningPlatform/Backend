import { RpcException } from '@nestjs/microservices'
import { GrpcErrorDto } from '../../../dtos'
import { Metadata, ServiceError } from '@grpc/grpc-js'

export class GrpcException extends RpcException {
  constructor(error: GrpcErrorDto, public readonly cause?: unknown) {
    const metadata = new Metadata()

    metadata.set('timestamp', error.timestamp)

    if(error.apiCode) {
      metadata.set('api-code', error.apiCode.toString())
    }

    super({
      code: error.code,
      message: error.message,
      details: String(error.details),
      metadata,
    } as ServiceError)
  }
}