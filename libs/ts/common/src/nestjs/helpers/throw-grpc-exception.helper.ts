import { ServiceError } from "@grpc/grpc-js";
import { GrpcException } from "../exceptions";
import { GrpcErrorDto } from "../../dtos";

export function throwGrpcException(err: ServiceError): never {
  const apiCodeField = err.metadata.get('api-code')

  const apiCode =
    apiCodeField[0]?.toString() || ''

  throw new GrpcException(
    new GrpcErrorDto(
      err.message,
      err.code,
      apiCode,
      err.details,
    ),
    err.cause,
  )
}