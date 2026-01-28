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
	type FindLearningPathsResponse,
	type FindOneLearningPathResponse,
	LEARNING_PATHS_SERVICE_NAME,
	type RemoveLearningPathResponse,
	type UpdateLearningPathResponse,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type z from 'zod';
import type {
	CreateLearningPathUseCase,
	FindLearningPathsUseCase,
	FindOneLearningPathUseCase,
	RemoveLearningPathUseCase,
	UpdateLearningPathUseCase,
} from '@/app/learning-paths/use-cases';
import {
	LearningPathCannotBeRemovedException,
	LearningPathNotFoundException,
} from '@/domain/learning-paths/exceptions';
import { DiToken } from '../common/enums';
import { errorCodeToMessage } from '../common/helpers/error-code-to-message.helper';
import { learningPathEntityToClient } from './helpers';
import {
	createLearningPathSchema,
	findLearningPathsSchema,
	findOneLearningPathSchema,
	removeLearningPathSchema,
	updateLearningPathSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcLearningPathsController {
	constructor(
		@Inject(DiToken.FIND_LEARNING_PATHS_USE_CASE)
		private readonly findLearningPathsUseCase: FindLearningPathsUseCase,
		@Inject(DiToken.FIND_ONE_LEARNING_PATH_USE_CASE)
		private readonly findOneLearningPathUseCase: FindOneLearningPathUseCase,
		@Inject(DiToken.CREATE_LEARNING_PATH_USE_CASE)
		private readonly createLearningPathUseCase: CreateLearningPathUseCase,
		@Inject(DiToken.UPDATE_LEARNING_PATH_USE_CASE)
		private readonly updateLearningPathUseCase: UpdateLearningPathUseCase,
		@Inject(DiToken.REMOVE_LEARNING_PATH_USE_CASE)
		private readonly removeLearningPathUseCase: RemoveLearningPathUseCase,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async find(
		@Payload(new RpcValidationPipe(findLearningPathsSchema)) payload: z.infer<
			typeof findLearningPathsSchema
		>,
	): Promise<FindLearningPathsResponse> {
		try {
			const learningPaths =
				await this.findLearningPathsUseCase.execute(payload);

			return {
				learningPaths: learningPaths.map(learningPathEntityToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async findOne(
		@Payload(new RpcValidationPipe(findOneLearningPathSchema))
		payload: z.infer<typeof findOneLearningPathSchema>,
	): Promise<FindOneLearningPathResponse> {
		try {
			const learningPath =
				await this.findOneLearningPathUseCase.execute(payload);

			return { learningPath: learningPathEntityToClient(learningPath) };
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
						],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createLearningPathSchema)) payload: z.infer<
			typeof createLearningPathSchema
		>,
	): Promise<CreateLearningPathResponse> {
		try {
			const createdLearningpath =
				await this.createLearningPathUseCase.execute(payload);

			return { learningPath: learningPathEntityToClient(createdLearningpath) };
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateLearningPathSchema)) payload: z.infer<
			typeof updateLearningPathSchema
		>,
	): Promise<UpdateLearningPathResponse> {
		try {
			const updatedLearningPath =
				await this.updateLearningPathUseCase.execute(payload);

			return { learningPath: learningPathEntityToClient(updatedLearningPath) };
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
						],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATHS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeLearningPathSchema)) payload: z.infer<
			typeof removeLearningPathSchema
		>,
	): Promise<RemoveLearningPathResponse> {
		try {
			const removedLearningPath =
				await this.removeLearningPathUseCase.execute(payload);

			return {
				learningPath: learningPathEntityToClient(removedLearningPath),
			};
		} catch (err) {
			if (err instanceof LearningPathCannotBeRemovedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.LEARNING_PATH_CANNOT_BE_REMOVED
						],
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.LEARNING_PATH_CANNOT_BE_REMOVED,
					),
				);
			}

			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
						],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}
}
