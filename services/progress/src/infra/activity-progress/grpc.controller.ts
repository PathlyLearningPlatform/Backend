import {
	CompleteActivityUseCase,
	FindActivityProgressByIdUseCase,
	FindOneActivityProgressUseCase,
	ListActivityProgressUseCase,
	RemoveActivityProgressByIdUseCase,
	StartActivityUseCase,
} from '@/app/activity-progress/use-cases';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import { DiToken, ExceptionMessage } from '../common/enums';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	ACTIVITY_PROGRESS_SERVICE_NAME,
	CompleteActivityResponse,
	FindActivityProgressByIdResponse,
	FindOneActivityProgressResponse,
	ListActivityProgressResponse,
	RemoveActivityProgressByIdResponse,
	StartActivityResponse,
} from '@pathly-backend/contracts/progress/v1/activities.js';
import {
	completeActivitySchema,
	findActivityProgressByIdSchema,
	findOneActivityProgressSchema,
	listActivityProgressSchema,
	removeActivityProgressByIdSchema,
	startActivitySchema,
} from './schemas';
import z from 'zod';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';
import { activityProgressToClient } from './helpers';
import {
	ActivityAlreadyCompletedException,
	ActivityProgressNotFoundException,
} from '@/domain/activity-progress/exceptions';
import { ActivityNotFoundException } from '@/app/common/exceptions';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcActivityProgressController {
	constructor(
		@Inject(DiToken.LIST_ACTIVITY_PROGRESS_USE_CASE)
		private readonly listUseCase: ListActivityProgressUseCase,
		@Inject(DiToken.FIND_ACTIVITY_PROGRESS_BY_ID_USE_CASE)
		private readonly findByIdUseCase: FindActivityProgressByIdUseCase,
		@Inject(DiToken.FIND_ONE_ACTIVITY_PROGRESS_USE_CASE)
		private readonly findOneUseCase: FindOneActivityProgressUseCase,
		@Inject(DiToken.START_ACTIVITY_USE_CASE)
		private readonly startUseCase: StartActivityUseCase,
		@Inject(DiToken.COMPLETE_ACTIVITY_USE_CASE)
		private readonly completeUseCase: CompleteActivityUseCase,
		@Inject(DiToken.REMOVE_ACTIVITY_PROGRESS_BY_ID_USE_CASE)
		private readonly removeByIdUseCase: RemoveActivityProgressByIdUseCase,
	) {}

	@GrpcMethod(ACTIVITY_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listActivityProgressSchema))
		payload: z.infer<typeof listActivityProgressSchema>,
	): Promise<ListActivityProgressResponse> {
		try {
			const result = await this.listUseCase.execute({
				fields: {
					userId: payload?.where?.userId,
				},
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
			});

			return {
				activityProgress: result.map(activityProgressToClient),
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
	async findOne(
		@Payload(new RpcValidationPipe(findOneActivityProgressSchema))
		payload: z.infer<typeof findOneActivityProgressSchema>,
	): Promise<FindOneActivityProgressResponse> {
		try {
			const result = await this.findOneUseCase.execute(
				payload.activityId,
				payload.userId,
			);

			return {
				activityProgress: activityProgressToClient(result),
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
			const result = await this.findByIdUseCase.execute(payload.id);

			return {
				activityProgress: activityProgressToClient(result),
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
	async start(
		@Payload(new RpcValidationPipe(startActivitySchema))
		payload: z.infer<typeof startActivitySchema>,
	): Promise<StartActivityResponse> {
		try {
			const result = await this.startUseCase.execute({
				activityId: payload.activityId,
				userId: payload.userId,
			});

			return {
				activityProgress: activityProgressToClient(result),
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

			if (err instanceof ActivityAlreadyCompletedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_ALREADY_COMPLETED,
						GrpcStatus.FAILED_PRECONDITION,
						ProgressApiErrorCodes.ACTIVITY_ALREADY_COMPLETED,
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
			const result = await this.completeUseCase.execute({
				activityId: payload.activityId,
				userId: payload.userId,
			});

			return {
				activityProgress: activityProgressToClient(result),
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
	async removeById(
		@Payload(new RpcValidationPipe(removeActivityProgressByIdSchema))
		payload: z.infer<typeof removeActivityProgressByIdSchema>,
	): Promise<RemoveActivityProgressByIdResponse> {
		try {
			await this.removeByIdUseCase.execute(payload.id);

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
