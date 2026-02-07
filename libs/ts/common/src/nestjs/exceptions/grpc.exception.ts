import { RpcException } from '@nestjs/microservices'
import { GrpcErrorDto } from '../../dtos'
import { Metadata, ServiceError } from '@grpc/grpc-js'

export class GrpcException extends RpcException {
  constructor(private grpcError: GrpcErrorDto, public readonly cause?: unknown) {
    const metadata = new Metadata()

    if (grpcError.apiCode != null) {
      metadata.set('api-code', grpcError.apiCode.toString())
    }

    super({
      code: grpcError.code,
      message: grpcError.message,
      details: String(grpcError.details),
      metadata,
    } as ServiceError)
  }

  getGrpcError(): GrpcErrorDto {
    return this.grpcError;
  }
}