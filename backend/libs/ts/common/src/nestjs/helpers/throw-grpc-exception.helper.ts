import { ServiceError } from "@grpc/grpc-js";
import { GrpcException } from "../exceptions";
import { GrpcErrorDto } from "../../dtos";

export function throwGrpcException(err: ServiceError): never {
  const apiCodeField = err.metadata.get('api-code')

  const apiCode =
    apiCodeField.length <= 0
      ? null
      : apiCodeField[0]!.toString()

  throw new GrpcException(
    new GrpcErrorDto(
      err.message,
      err.code,
      apiCode ? parseInt(apiCode, 10) : null,
      err.details,
    ),
    err.cause,
  )
}