import {
	FindLessonProgressByIdUseCase,
	FindOneLessonProgressForUserUseCase,
	ListLessonProgressUseCase,
	RemoveLessonProgressByIdUseCase,
	StartLessonUseCase,
} from '@/app/lesson-progress/use-cases';
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
	LESSON_PROGRESS_SERVICE_NAME,
	ListLessonProgressResponse,
	FindLessonProgressByIdResponse,
	RemoveLessonProgressByIdResponse,
	StartLessonResponse,
	FindOneLessonProgressForUserResponse,
} from '@pathly-backend/contracts/progress/v1/lessons.js';
import {
	findLessonProgressByIdSchema,
	findOneLessonForUserProgressSchema,
	listLessonProgressSchema,
	removeLessonProgressByIdSchema,
	startLessonSchema,
} from './schemas';
import z from 'zod';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';
import { lessonProgressToClient } from './helpers';
import { ActivityAlreadyCompletedException } from '@/domain/activity-progress/exceptions';
import { LessonNotFoundException } from '@/app/common/exceptions';
import { LessonProgressNotFoundException } from '@/domain/lesson-progress/exceptions';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcLessonProgressController {
	constructor(
		@Inject(DiToken.LIST_LESSON_PROGRESS_USE_CASE)
		private readonly listUseCase: ListLessonProgressUseCase,
		@Inject(DiToken.FIND_LESSON_PROGRESS_BY_ID_USE_CASE)
		private readonly findByIdUseCase: FindLessonProgressByIdUseCase,
		@Inject(DiToken.FIND_ONE_LESSON_PROGRESS_FOR_USER_USE_CASE)
		private readonly findOneForUserUseCase: FindOneLessonProgressForUserUseCase,
		@Inject(DiToken.START_LESSON_USE_CASE)
		private readonly startUseCase: StartLessonUseCase,
		@Inject(DiToken.REMOVE_LESSON_PROGRESS_BY_ID_USE_CASE)
		private readonly removeByIdUseCase: RemoveLessonProgressByIdUseCase,
	) {}

	@GrpcMethod(LESSON_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listLessonProgressSchema))
		payload: z.infer<typeof listLessonProgressSchema>,
	): Promise<ListLessonProgressResponse> {
		try {
			const result = await this.listUseCase.execute({
				where: {
					userId: payload?.where?.userId,
				},
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
			});

			return {
				lessonProgress: result.map(lessonProgressToClient),
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

	@GrpcMethod(LESSON_PROGRESS_SERVICE_NAME)
	async findOneForUser(
		@Payload(new RpcValidationPipe(findOneLessonForUserProgressSchema))
		payload: z.infer<typeof findOneLessonForUserProgressSchema>,
	): Promise<FindOneLessonProgressForUserResponse> {
		try {
			const result = await this.findOneForUserUseCase.execute(
				payload.lessonId,
				payload.userId,
			);

			return {
				lessonProgress: lessonProgressToClient(result),
			};
		} catch (err) {
			if (err instanceof LessonProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LESSON_PROGRESS_NOT_FOUND,
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
	@GrpcMethod(LESSON_PROGRESS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findLessonProgressByIdSchema))
		payload: z.infer<typeof findLessonProgressByIdSchema>,
	): Promise<FindLessonProgressByIdResponse> {
		try {
			const result = await this.findByIdUseCase.execute(payload.id);

			return {
				lessonProgress: lessonProgressToClient(result),
			};
		} catch (err) {
			if (err instanceof LessonProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LESSON_PROGRESS_NOT_FOUND,
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

	@GrpcMethod(LESSON_PROGRESS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startLessonSchema))
		payload: z.infer<typeof startLessonSchema>,
	): Promise<StartLessonResponse> {
		try {
			const result = await this.startUseCase.execute({
				lessonId: payload.lessonId,
				userId: payload.userId,
			});

			return {
				lessonProgress: lessonProgressToClient(result),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LESSON_NOT_FOUND,
					),
					err,
				);
			}

			if (err instanceof ActivityAlreadyCompletedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_ALREADY_COMPLETED,
						GrpcStatus.FAILED_PRECONDITION,
						ProgressApiErrorCodes.LESSON_ALREADY_COMPLETED,
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

	@GrpcMethod(LESSON_PROGRESS_SERVICE_NAME)
	async removeById(
		@Payload(new RpcValidationPipe(removeLessonProgressByIdSchema))
		payload: z.infer<typeof removeLessonProgressByIdSchema>,
	): Promise<RemoveLessonProgressByIdResponse> {
		try {
			await this.removeByIdUseCase.execute(payload.id);

			return {};
		} catch (err) {
			if (err instanceof LessonProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.LESSON_PROGRESS_NOT_FOUND,
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
