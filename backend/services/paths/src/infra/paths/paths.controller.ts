import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import {
	AppLogger,
	emptyStringToNull,
	GrpcErrorDto,
	GrpcException,
	nullToEmptyString,
	RpcValidationPipe,
	SortType,
} from 'common/index.js';
import { SortType as ClientSortType } from 'contracts/common/types.js';
import type {
	CreateResponse,
	FindOneResponse,
	FindResponse,
	Path as PathResponseDto,
	RemoveResponse,
	UpdateResponse,
} from 'contracts/paths/v1/paths.js';
import type z from 'zod';
import type {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';
import type {
	CreatePathCommand,
	FindOnePathCommand,
	FindPathsCommand,
	RemovePathCommand,
	UpdatePathComand,
} from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import { DiToken } from '../common/enums';
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
	) { }

	@GrpcMethod('PathsService')
	async find(
		@Payload(new RpcValidationPipe(findPathsSchema)) payload: z.infer<
			typeof findPathsSchema
		>,
	): Promise<FindResponse> {
		const command = this.findRequestToCommand(payload);

		try {
			const paths = await this.findPathsUseCase.execute(command);

			return {
				paths: paths.map(this.domainToResponseDto),
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
	): Promise<FindOneResponse> {
		const command = this.findOneRequestToCommand(payload);

		try {
			const path = await this.findOnePathUseCase.execute(command);

			return { path: this.domainToResponseDto(path) };
		} catch (err) {
			if (err instanceof PathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto('path not found', GrpcStatus.NOT_FOUND),
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
	): Promise<CreateResponse> {
		const command = this.createRequestToCommand(payload);

		try {
			const path = await this.createPathUseCase.execute(command);

			return { path: this.domainToResponseDto(path) };
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
	): Promise<UpdateResponse> {
		const command = this.updateRequestToCommand(payload);

		try {
			const path = await this.updatePathUseCase.execute(command);

			return { path: this.domainToResponseDto(path) };
		} catch (err) {
			if (err instanceof PathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto('path not found', GrpcStatus.NOT_FOUND),
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
	): Promise<RemoveResponse> {
		const command = this.removeRequestToCommand(payload);

		try {
			const path = await this.removePathUseCase.execute(command);

			return {
				path: this.domainToResponseDto(path),
			};
		} catch (err) {
			if (err instanceof PathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto('path not found', GrpcStatus.NOT_FOUND),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	private domainToResponseDto(domain: Path): PathResponseDto {
		return { ...domain, description: nullToEmptyString(domain.description) };
	}
	private findRequestToCommand(
		request: z.infer<typeof findPathsSchema>,
	): FindPathsCommand {
		return {
			...request,
			where: {
				sortType:
					request.where?.sortType === ClientSortType.ASC
						? SortType.ASC
						: SortType.DESC,
			},
		};
	}
	private findOneRequestToCommand(
		request: z.infer<typeof findOnePathSchema>,
	): FindOnePathCommand {
		return request;
	}
	private createRequestToCommand(
		request: z.infer<typeof createPathSchema>,
	): CreatePathCommand {
		return {
			...request,
			description: emptyStringToNull(request.description),
		};
	}
	private updateRequestToCommand(
		request: z.infer<typeof updatePathSchema>,
	): UpdatePathComand {
		return {
			...request,
			fields: { description: emptyStringToNull(request.fields?.description) },
		};
	}
	private removeRequestToCommand(
		request: z.infer<typeof removePathSchema>,
	): RemovePathCommand {
		return request;
	}
}
