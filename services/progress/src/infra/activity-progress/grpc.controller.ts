import { Controller, Inject } from '@nestjs/common';
import { DiToken, ExceptionMessage } from '../common';
import { ActivityNotFoundException } from '@/app/common';
import {
	ActivityProgressNotFoundException,
	LessonNotStartedException,
} from '@/app/activity-progress';
import type {
	CompleteActivityHandler,
	FindActivityProgressByIdHandler,
	FindActivityProgressForUserHandler,
	ListActivityProgressHandler,
	RemoveActivityProgressHandler,
} from '@/app/activity-progress';
import {
	ACTIVITY_PROGRESS_SERVICE_NAME,
	type CompleteActivityResponse,
	type FindActivityProgressByIdResponse,
	type FindActivityProgressForUserResponse,
	type ListActivityProgressResponse,
	type RemoveActivityProgressResponse,
} from '@pathly-backend/contracts/progress/v1/activities.js';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import {
	completeActivitySchema,
	findActivityProgressByIdSchema,
	findActivityProgressForUserSchema,
	listActivityProgressSchema,
	removeActivityProgressSchema,
} from './schemas';
import type z from 'zod';
import { activityProgressDtoToClient } from './helpers';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';

@Controller()
export class GrpcActivityProgressController {
	constructor(
		@Inject(DiToken.LIST_ACTIVITY_PROGRESS_HANDLER)
		private readonly listHandler: ListActivityProgressHandler,
		@Inject(DiToken.FIND_ACTIVITY_PROGRESS_BY_ID_HANDLER)
		private readonly findByIdHandler: FindActivityProgressByIdHandler,
		@Inject(DiToken.FIND_ACTIVITY_PROGRESS_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindActivityProgressForUserHandler,
		@Inject(DiToken.COMPLETE_ACTIVITY_HANDLER)
		private readonly completeHandler: CompleteActivityHandler,
		@Inject(DiToken.REMOVE_ACTIVITY_PROGRESS_HANDLER)
		private readonly removeHandler: RemoveActivityProgressHandler,
	) {}

	@GrpcMethod(ACTIVITY_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listActivityProgressSchema))
		payload: z.infer<typeof listActivityProgressSchema>,
	): Promise<ListActivityProgressResponse> {
		try {
			const result = await this.listHandler.execute({
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
				where: {
					lessonId: payload?.where?.lessonId,
					userId: payload?.where?.userId,
				},
			});

			return {
				activityProgress: result.map(activityProgressDtoToClient),
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

	@GrpcMethod(ACTIVITY_PROGRESS_SERVICE_NAME)
	async findForUser(
		@Payload(new RpcValidationPipe(findActivityProgressForUserSchema))
		payload: z.infer<typeof findActivityProgressForUserSchema>,
	): Promise<FindActivityProgressForUserResponse> {
		try {
			const result = await this.findForUserHandler.execute({
				activityId: payload.activityId,
				userId: payload.userId,
			});

			return {
				activityProgress: activityProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof ActivityProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.ACTIVITY_PROGRESS_NOT_FOUND,
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

	@GrpcMethod(ACTIVITY_PROGRESS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findActivityProgressByIdSchema))
		payload: z.infer<typeof findActivityProgressByIdSchema>,
	): Promise<FindActivityProgressByIdResponse> {
		try {
			const result = await this.findByIdHandler.execute({
				id: payload.id,
			});

			return {
				activityProgress: activityProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof ActivityProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.ACTIVITY_PROGRESS_NOT_FOUND,
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

	@GrpcMethod(ACTIVITY_PROGRESS_SERVICE_NAME)
	async complete(
		@Payload(new RpcValidationPipe(completeActivitySchema))
		payload: z.infer<typeof completeActivitySchema>,
	): Promise<CompleteActivityResponse> {
		try {
			const result = await this.completeHandler.execute({
				activityId: payload.activityId,
				userId: payload.userId,
			});

			return {
				activityProgress: activityProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.ACTIVITY_NOT_FOUND,
					),
					err,
				);
			}

			if (err instanceof LessonNotStartedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_NOT_STARTED,
						GrpcStatus.FAILED_PRECONDITION,
						ProgressApiErrorCodes.LESSON_NOT_STARTED,
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

	@GrpcMethod(ACTIVITY_PROGRESS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeActivityProgressSchema))
		payload: z.infer<typeof removeActivityProgressSchema>,
	): Promise<RemoveActivityProgressResponse> {
		try {
			await this.removeHandler.execute({
				id: payload.id,
			});

			return {};
		} catch (err) {
			if (err instanceof ActivityProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.ACTIVITY_PROGRESS_NOT_FOUND,
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
