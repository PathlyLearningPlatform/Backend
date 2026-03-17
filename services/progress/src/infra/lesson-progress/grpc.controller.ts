import { Controller, Inject } from '@nestjs/common';
import { DiToken, ExceptionMessage } from '../common';
import { LessonNotFoundException } from '@/app/common';
import {
	LessonProgressNotFoundException,
	UnitNotStartedException,
} from '@/app/lesson-progress';
import type {
	FindLessonProgressByIdHandler,
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
	RemoveLessonProgressHandler,
	StartLessonHandler,
} from '@/app/lesson-progress';
import {
	LESSON_PROGRESS_SERVICE_NAME,
	type FindLessonProgressByIdResponse,
	type FindLessonProgressForUserResponse,
	type ListLessonProgressResponse,
	type RemoveLessonProgressResponse,
	type StartLessonResponse,
} from '@pathly-backend/contracts/progress/v1/lessons.js';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import {
	findLessonProgressByIdSchema,
	findLessonProgressForUserSchema,
	listLessonProgressSchema,
	removeLessonProgressSchema,
	startLessonSchema,
} from './schemas';
import type z from 'zod';
import { lessonProgressDtoToClient } from './helpers';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';

@Controller()
export class GrpcLessonProgressController {
	constructor(
		@Inject(DiToken.LIST_LESSON_PROGRESS_HANDLER)
		private readonly listHandler: ListLessonProgressHandler,
		@Inject(DiToken.FIND_LESSON_PROGRESS_BY_ID_HANDLER)
		private readonly findByIdHandler: FindLessonProgressByIdHandler,
		@Inject(DiToken.FIND_LESSON_PROGRESS_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindLessonProgressForUserHandler,
		@Inject(DiToken.START_LESSON_HANDLER)
		private readonly startHandler: StartLessonHandler,
		@Inject(DiToken.REMOVE_LESSON_PROGRESS_HANDLER)
		private readonly removeHandler: RemoveLessonProgressHandler,
	) {}

	@GrpcMethod(LESSON_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listLessonProgressSchema))
		payload: z.infer<typeof listLessonProgressSchema>,
	): Promise<ListLessonProgressResponse> {
		try {
			const result = await this.listHandler.execute({
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
				where: {
					unitId: payload?.where?.unitId,
					userId: payload?.where?.userId,
				},
			});

			return {
				lessonProgress: result.map(lessonProgressDtoToClient),
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
	async findForUser(
		@Payload(new RpcValidationPipe(findLessonProgressForUserSchema))
		payload: z.infer<typeof findLessonProgressForUserSchema>,
	): Promise<FindLessonProgressForUserResponse> {
		try {
			const result = await this.findForUserHandler.execute({
				lessonId: payload.lessonId,
				userId: payload.userId,
			});

			return {
				lessonProgress: lessonProgressDtoToClient(result),
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
			const result = await this.findByIdHandler.execute({
				id: payload.id,
			});

			return {
				lessonProgress: lessonProgressDtoToClient(result),
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
			const result = await this.startHandler.execute({
				lessonId: payload.lessonId,
				userId: payload.userId,
			});

			return {
				lessonProgress: lessonProgressDtoToClient(result),
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

			if (err instanceof UnitNotStartedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_STARTED,
						GrpcStatus.FAILED_PRECONDITION,
						ProgressApiErrorCodes.UNIT_NOT_STARTED,
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
	async remove(
		@Payload(new RpcValidationPipe(removeLessonProgressSchema))
		payload: z.infer<typeof removeLessonProgressSchema>,
	): Promise<RemoveLessonProgressResponse> {
		try {
			await this.removeHandler.execute({
				id: payload.id,
			});

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
