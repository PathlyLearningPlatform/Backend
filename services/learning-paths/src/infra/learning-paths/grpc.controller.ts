import type {
	FindLearningPathByIdHandler,
	FindLearningPathProgressForUserHandler,
	ListLearningPathProgressHandler,
	ListLearningPathsHandler,
} from '@app/learning-paths/queries';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import type {
	LearningPathsServiceFindOneProgressForUserResponse,
	LearningPathsServiceListProgressResponse,
	LearningPathsServiceRemoveProgressResponse,
	LearningPathsServiceStartResponse,
} from '@pathly-backend/contracts/learning_paths/v1/learning_paths.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateLearningPathResponse,
	type FindLearningPathByIdResponse,
	LEARNING_PATHS_SERVICE_NAME,
	type ListLearningPathsResponse,
	type UpdateLearningPathResponse,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type z from 'zod';
import { LearningPathNotFoundException } from '@/app/common';
import type {
	CreateLearningPathHandler,
	RemoveLearningPathHandler,
	RemoveLearningPathProgressHandler,
	StartLearningPathHandler,
	UpdateLearningPathHandler,
} from '@/app/learning-paths/commands';
import { LearningPathProgressNotFoundException } from '@/app/learning-paths/exceptions';
import { LearningPathCannotBeRemovedException } from '@/domain/learning-paths/exceptions';
import { DiToken, ExceptionMessage } from '../common/enums';
import {
	learningPathDtoToClient,
	learningPathProgressDtoToClient,
} from './helpers';
import {
	createLearningPathSchema,
	findLearningPathByIdSchema,
	findLearningPathProgressForUserSchema,
	listLearningPathProgressSchema,
	listLearningPathsSchema,
	removeLearningPathProgressSchema,
	removeLearningPathSchema,
	startLearningPathSchema,
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
		@Inject(DiToken.START_LEARNING_PATH_HANDLER)
		private readonly startLearningPathHandler: StartLearningPathHandler,
		@Inject(DiToken.REMOVE_LEARNING_PATH_PROGRESS_HANDLER)
		private readonly removeLearningPathProgressHandler: RemoveLearningPathProgressHandler,
		@Inject(DiToken.FIND_LEARNING_PATH_PROGRESS_FOR_USER_HANDLER)
		private readonly findLearningPathProgressForUserHandler: FindLearningPathProgressForUserHandler,
		@Inject(DiToken.LIST_LEARNING_PATH_PROGRESS_HANDLER)
		private readonly listLearningPathProgressHandler: ListLearningPathProgressHandler,
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

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startLearningPathSchema))
		payload: z.infer<typeof startLearningPathSchema>,
	): Promise<LearningPathsServiceStartResponse> {
		try {
			const progress = await this.startLearningPathHandler.execute({
				learningPathId: payload.learningPathId,
				userId: payload.userId,
			});

			return {
				progress: learningPathProgressDtoToClient(progress),
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
	async removeProgress(
		@Payload(new RpcValidationPipe(removeLearningPathProgressSchema))
		payload: z.infer<typeof removeLearningPathProgressSchema>,
	): Promise<LearningPathsServiceRemoveProgressResponse> {
		try {
			await this.removeLearningPathProgressHandler.execute({
				learningPathId: payload.learningPathId,
				userId: payload.userId,
			});

			return {};
		} catch (err) {
			if (err instanceof LearningPathProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_PROGRESS_NOT_FOUND,
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
	async findOneProgressForUser(
		@Payload(new RpcValidationPipe(findLearningPathProgressForUserSchema))
		payload: z.infer<typeof findLearningPathProgressForUserSchema>,
	): Promise<LearningPathsServiceFindOneProgressForUserResponse> {
		try {
			const progress =
				await this.findLearningPathProgressForUserHandler.execute({
					learningPathId: payload.learningPathId,
					userId: payload.userId,
				});

			return {
				progress: learningPathProgressDtoToClient(progress),
			};
		} catch (err) {
			if (err instanceof LearningPathProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_PROGRESS_NOT_FOUND,
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
	async listProgress(
		@Payload(new RpcValidationPipe(listLearningPathProgressSchema))
		payload: z.infer<typeof listLearningPathProgressSchema>,
	): Promise<LearningPathsServiceListProgressResponse> {
		try {
			const progress = await this.listLearningPathProgressHandler.execute({
				options: payload.options,
				where: {
					userId: payload.where?.userId,
				},
			});

			return {
				progress: progress.map(learningPathProgressDtoToClient),
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
}
