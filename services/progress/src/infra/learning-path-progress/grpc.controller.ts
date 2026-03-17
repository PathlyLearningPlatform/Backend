import { Controller, Inject } from '@nestjs/common';
import { DiToken, ExceptionMessage } from '../common';
import { LearningPathNotFoundException } from '@/app/common';
import { LearningPathProgressNotFoundException } from '@/app/learning-path-progress';
import type {
	FindLearningPathProgressByIdHandler,
	FindLearningPathProgressForUserHandler,
	ListLearningPathProgressHandler,
	RemoveLearningPathProgressHandler,
	StartLearningPathHandler,
} from '@/app/learning-path-progress';
import {
	LEARNING_PATH_PROGRESS_SERVICE_NAME,
	type FindLearningPathProgressByIdResponse,
	type FindLearningPathProgressForUserResponse,
	type ListLearningPathProgressResponse,
	type RemoveLearningPathProgressResponse,
	type StartLearningPathResponse,
} from '@pathly-backend/contracts/progress/v1/learning-paths.js';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import {
	findLearningPathProgressByIdSchema,
	findLearningPathProgressForUserSchema,
	listLearningPathProgressSchema,
	removeLearningPathProgressSchema,
	startLearningPathSchema,
} from './schemas';
import type z from 'zod';
import { learningPathProgressDtoToClient } from './helpers';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';

@Controller()
export class GrpcLearningPathProgressController {
	constructor(
		@Inject(DiToken.LIST_LEARNING_PATH_PROGRESS_HANDLER)
		private readonly listHandler: ListLearningPathProgressHandler,
		@Inject(DiToken.FIND_LEARNING_PATH_PROGRESS_BY_ID_HANDLER)
		private readonly findByIdHandler: FindLearningPathProgressByIdHandler,
		@Inject(DiToken.FIND_LEARNING_PATH_PROGRESS_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindLearningPathProgressForUserHandler,
		@Inject(DiToken.START_LEARNING_PATH_HANDLER)
		private readonly startHandler: StartLearningPathHandler,
		@Inject(DiToken.REMOVE_LEARNING_PATH_PROGRESS_HANDLER)
		private readonly removeHandler: RemoveLearningPathProgressHandler,
	) {}

	@GrpcMethod(LEARNING_PATH_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listLearningPathProgressSchema))
		payload: z.infer<typeof listLearningPathProgressSchema>,
	): Promise<ListLearningPathProgressResponse> {
		try {
			const result = await this.listHandler.execute({
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
				where: {
					userId: payload?.where?.userId,
				},
			});

			return {
				learningPathProgress: result.map(learningPathProgressDtoToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATH_PROGRESS_SERVICE_NAME)
	async findForUser(
		@Payload(new RpcValidationPipe(findLearningPathProgressForUserSchema))
		payload: z.infer<typeof findLearningPathProgressForUserSchema>,
	): Promise<FindLearningPathProgressForUserResponse> {
		try {
			const result = await this.findForUserHandler.execute({
				learningPathId: payload.learningPathId,
				userId: payload.userId,
			});

			return {
				learningPathProgress: learningPathProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof LearningPathProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LEARNING_PATH_PROGRESS_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATH_PROGRESS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findLearningPathProgressByIdSchema))
		payload: z.infer<typeof findLearningPathProgressByIdSchema>,
	): Promise<FindLearningPathProgressByIdResponse> {
		try {
			const result = await this.findByIdHandler.execute({
				id: payload.id,
			});

			return {
				learningPathProgress: learningPathProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof LearningPathProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LEARNING_PATH_PROGRESS_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATH_PROGRESS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startLearningPathSchema))
		payload: z.infer<typeof startLearningPathSchema>,
	): Promise<StartLearningPathResponse> {
		try {
			const result = await this.startHandler.execute({
				learningPathId: payload.learningPathId,
				userId: payload.userId,
			});

			return {
				learningPathProgress: learningPathProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(LEARNING_PATH_PROGRESS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeLearningPathProgressSchema))
		payload: z.infer<typeof removeLearningPathProgressSchema>,
	): Promise<RemoveLearningPathProgressResponse> {
		try {
			await this.removeHandler.execute({
				id: payload.id,
			});

			return {};
		} catch (err) {
			if (err instanceof LearningPathProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LEARNING_PATH_PROGRESS_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}
}
