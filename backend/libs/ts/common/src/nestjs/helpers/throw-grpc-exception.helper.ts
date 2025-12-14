import { GrpcErrorDto } from "../../dtos";
import {status as GrpcStatus} from '@grpc/grpc-js'
import { GrpcException } from "../exceptions";

export function throwGrpcError(err: GrpcErrorDto): never {
  throw new GrpcException(new GrpcErrorDto(err.message, err.code, err.details))
}