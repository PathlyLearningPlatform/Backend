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
	type CreateLessonResponse,
	type FindOneLessonResponse,
	type FindLessonsResponse,
	type RemoveLessonResponse,
	type UpdateLessonResponse,
	LESSONS_SERVICE_NAME,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import type z from 'zod';
import type {
	CreateLessonUseCase,
	FindOneLessonUseCase,
	FindLessonsUseCase,
	RemoveLessonUseCase,
	UpdateLessonUseCase,
} from '@/app/lessons/use-cases';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { DiToken } from '../common/enums';
import { lessonEntityToClient } from './helpers';
import {
	createLessonSchema,
	findOneLessonSchema,
	findLessonsSchema,
	removeLessonSchema,
	updateLessonSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcLessonsController {
	constructor(
		@Inject(DiToken.FIND_LESSONS_USE_CASE)
		private readonly findLessonsUseCase: FindLessonsUseCase,
		@Inject(DiToken.FIND_ONE_LESSON_USE_CASE)
		private readonly findOneLessonUseCase: FindOneLessonUseCase,
		@Inject(DiToken.CREATE_LESSON_USE_CASE)
		private readonly createLessonUseCase: CreateLessonUseCase,
		@Inject(DiToken.UPDATE_LESSON_USE_CASE)
		private readonly updateLessonUseCase: UpdateLessonUseCase,
		@Inject(DiToken.REMOVE_LESSON_USE_CASE)
		private readonly removeLessonUseCase: RemoveLessonUseCase,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {}

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async find(
		@Payload(new RpcValidationPipe(findLessonsSchema)) payload: z.infer<
			typeof findLessonsSchema
		>,
	): Promise<FindLessonsResponse> {
		try {
			const lessons = await this.findLessonsUseCase.execute(payload);

			return {
				lessons: lessons.map(lessonEntityToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async findOne(
		@Payload(new RpcValidationPipe(findOneLessonSchema))
		payload: z.infer<typeof findOneLessonSchema>,
	): Promise<FindOneLessonResponse> {
		try {
			const lesson = await this.findOneLessonUseCase.execute(payload);

			return { lesson: lessonEntityToClient(lesson) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'lesson not found',
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createLessonSchema)) payload: z.infer<
			typeof createLessonSchema
		>,
	): Promise<CreateLessonResponse> {
		try {
			const lesson = await this.createLessonUseCase.execute(payload);

			return { lesson: lessonEntityToClient(lesson) };
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'path not found',
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateLessonSchema)) payload: z.infer<
			typeof updateLessonSchema
		>,
	): Promise<UpdateLessonResponse> {
		try {
			const lesson = await this.updateLessonUseCase.execute(payload);

			return { lesson: lessonEntityToClient(lesson) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'lesson not found',
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeLessonSchema)) payload: z.infer<
			typeof removeLessonSchema
		>,
	): Promise<RemoveLessonResponse> {
		try {
			const lesson = await this.removeLessonUseCase.execute(payload);

			return {
				lesson: lessonEntityToClient(lesson),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'lesson not found',
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
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
