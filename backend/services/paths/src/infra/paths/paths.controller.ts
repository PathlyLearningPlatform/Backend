import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	AppLogger,
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common';
import type {
	CreatePathResponse,
	FindOnePathResponse,
	FindPathsResponse,
	RemovePathResponse,
	UpdatePathResponse,
} from '@pathly-backend/contracts/paths/v1/paths.js';
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js';
import type z from 'zod';
import type {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';
import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from '@/domain/paths/exceptions';
import { DiToken } from '../common/enums';
import { pathEntityToClient } from './helpers';
import {
	createPathSchema,
	findOnePathSchema,
	findPathsSchema,
	removePathSchema,
	updatePathSchema,
} from './schemas';

@Controller()
export class PathsController {
	constructor(
		@Inject(DiToken.FIND_PATHS_USE_CASE)
		private readonly findPathsUseCase: FindPathsUseCase,
		@Inject(DiToken.FIND_ONE_PATH_USE_CASE)
		private readonly findOnePathUseCase: FindOnePathUseCase,
		@Inject(DiToken.CREATE_PATH_USE_CASE)
		private readonly createPathUseCase: CreatePathUseCase,
		@Inject(DiToken.UPDATE_PATH_USE_CASE)
		private readonly updatePathUseCase: UpdatePathUseCase,
		@Inject(DiToken.REMOVE_PATH_USE_CASE)
		private readonly removePathUseCase: RemovePathUseCase,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {}

	@GrpcMethod('PathsService')
	async find(
		@Payload(new RpcValidationPipe(findPathsSchema)) payload: z.infer<
			typeof findPathsSchema
		>,
	): Promise<FindPathsResponse> {
		try {
			const paths = await this.findPathsUseCase.execute(payload);

			return {
				paths: paths.map(pathEntityToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('PathsService')
	async findOne(
		@Payload(new RpcValidationPipe(findOnePathSchema))
		payload: z.infer<typeof findOnePathSchema>,
	): Promise<FindOnePathResponse> {
		try {
			const path = await this.findOnePathUseCase.execute(payload);

			return { path: pathEntityToClient(path) };
		} catch (err) {
			if (err instanceof PathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'path not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('PathsService')
	async create(
		@Payload(new RpcValidationPipe(createPathSchema)) payload: z.infer<
			typeof createPathSchema
		>,
	): Promise<CreatePathResponse> {
		try {
			const path = await this.createPathUseCase.execute(payload);

			return { path: pathEntityToClient(path) };
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('PathsService')
	async update(
		@Payload(new RpcValidationPipe(updatePathSchema)) payload: z.infer<
			typeof updatePathSchema
		>,
	): Promise<UpdatePathResponse> {
		try {
			const path = await this.updatePathUseCase.execute(payload);

			return { path: pathEntityToClient(path) };
		} catch (err) {
			if (err instanceof PathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'path not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('PathsService')
	async remove(
		@Payload(new RpcValidationPipe(removePathSchema)) payload: z.infer<
			typeof removePathSchema
		>,
	): Promise<RemovePathResponse> {
		try {
			const path = await this.removePathUseCase.execute(payload);

			return {
				path: pathEntityToClient(path),
			};
		} catch (err) {
			if (err instanceof PathCannotBeRemovedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'Path cannot be removed because it has sections',
						GrpcStatus.FAILED_PRECONDITION,
						PathsApiErrorCodes.PATH_CANNOT_BE_REMOVED,
					),
				);
			}

			if (err instanceof PathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'path not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}
}
