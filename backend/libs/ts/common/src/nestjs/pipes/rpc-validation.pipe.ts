import { status as GrpcStatus } from '@grpc/grpc-js';
import {
  type ArgumentMetadata,
  Injectable,
  Logger,
  type PipeTransform,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ZodError, ZodType } from 'zod';
import { GrpcErrorDto } from '../../dtos/grpc-error.dto.js';

@Injectable()
export class RpcValidationPipe implements PipeTransform {
  private logger = new Logger(RpcValidationPipe.name);

  constructor(private readonly schema: ZodType) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);

      this.logger.debug('parsed request body: ', parsedValue);

      return parsedValue;
    } catch (err) {
      if (err instanceof ZodError) {
        const validationErrors = [
          ...err.issues.map((issue) => {
            return {
              fields: issue.path.length > 0 ? issue.path : null,
              code: issue.code,
              message: issue.message,
            };
          }),
        ];

        throw new RpcException(new GrpcErrorDto(err.message, GrpcStatus.INVALID_ARGUMENT, validationErrors))
      }

      throw new RpcException(new GrpcErrorDto('validation failed', GrpcStatus.INVALID_ARGUMENT));
    }
  }
}