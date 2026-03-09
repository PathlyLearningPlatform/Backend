import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	AppLogger,
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateLearningPathResponse,
	FindLearningPathByIdResponse,
	LEARNING_PATHS_SERVICE_NAME,
	ListLearningPathsResponse,
	type UpdateLearningPathResponse,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type z from 'zod';
import {
	CreateLearningPathHandler,
	RemoveLearningPathHandler,
	UpdateLearningPathHandler,
} from '@/app/learning-paths/commands';
import {
	FindLearningPathByIdHandler,
	ListLearningPathsHandler,
} from '@app/learning-paths/queries';
import { LearningPathNotFoundException } from '@/app/common';
import { LearningPathCannotBeRemovedException } from '@/domain/learning-paths/exceptions';
import { DiToken, ExceptionMessage } from '../common/enums';
import { learningPathDtoToClient } from './helpers';
import {
	createLearningPathSchema,
	listLearningPathsSchema,
	findLearningPathByIdSchema,
	removeLearningPathSchema,
	updateLearningPathSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcLearningPathsController {
	constructor(
		@Inject(DiToken.LIST_LEARNING_PATHS_HANDLER)
		private readonly listLearningPathsHandler: ListLearningPathsHandler,
		@Inject(DiToken.FIND_LEARNING_PATH_BY_ID_HANDLER)
		private readonly findLearningPathByIdHandler: FindLearningPathByIdHandler,
		@Inject(DiToken.CREATE_LEARNING_PATH_HANDLER)
		private readonly createLearningPathHandler: CreateLearningPathHandler,
		@Inject(DiToken.UPDATE_LEARNING_PATH_HANDLER)
		private readonly updateLearningPathHandler: UpdateLearningPathHandler,
		@Inject(DiToken.REMOVE_LEARNING_PATH_HANDLER)
		private readonly removeLearningPathHandler: RemoveLearningPathHandler,
	) {}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listLearningPathsSchema)) payload: z.infer<
			typeof listLearningPathsSchema
		>,
	): Promise<ListLearningPathsResponse> {
		try {
			const learningPaths =
				await this.listLearningPathsHandler.execute(payload);

			return {
				learningPaths: learningPaths.map(learningPathDtoToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findLearningPathByIdSchema))
		payload: z.infer<typeof findLearningPathByIdSchema>,
	): Promise<FindLearningPathByIdResponse> {
		try {
			const learningPath = await this.findLearningPathByIdHandler.execute({
				where: {
					id: payload.where.id,
				},
			});

			return { learningPath: learningPathDtoToClient(learningPath) };
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createLearningPathSchema))
		payload: z.infer<typeof createLearningPathSchema>,
	): Promise<CreateLearningPathResponse> {
		try {
			const createdLearningpath =
				await this.createLearningPathHandler.execute(payload);

			return {
				learningPath: learningPathDtoToClient(createdLearningpath),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateLearningPathSchema))
		payload: z.infer<typeof updateLearningPathSchema>,
	): Promise<UpdateLearningPathResponse> {
		try {
			const updatedLearningPath =
				await this.updateLearningPathHandler.execute(payload);

			return {
				learningPath: learningPathDtoToClient(updatedLearningPath),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeLearningPathSchema))
		payload: z.infer<typeof removeLearningPathSchema>,
	): Promise<void> {
		try {
			await this.removeLearningPathHandler.execute({
				where: { id: payload.where.id },
			});
		} catch (err) {
			if (err instanceof LearningPathCannotBeRemovedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_CANNOT_BE_REMOVED,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.LEARNING_PATH_CANNOT_BE_REMOVED,
					),
				);
			}

			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}
}
