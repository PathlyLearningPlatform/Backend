import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateLessonResponse,
	type FindLessonByIdResponse,
	type ListLessonsResponse,
	type UpdateLessonResponse,
	LESSONS_SERVICE_NAME,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import type z from 'zod';
import type {
	AddLessonHandler,
	ReorderLessonHandler,
} from '@/app/units/commands';
import type {
	UpdateLessonHandler,
	RemoveLessonHandler,
} from '@/app/lessons/commands';
import type {
	ListLessonsHandler,
	FindLessonByIdHandler,
} from '@/app/lessons/queries';
import { UnitNotFoundException, LessonNotFoundException } from '@/app/common';
import { DiToken, ExceptionMessage } from '../common/enums';
import { lessonDtoToClient } from './helpers';
import {
	createLessonSchema,
	listLessonsSchema,
	findLessonByIdSchema,
	removeLessonSchema,
	updateLessonSchema,
	reorderLessonSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcLessonsController {
	constructor(
		@Inject(DiToken.LIST_LESSONS_HANDLER)
		private readonly listLessonsHandler: ListLessonsHandler,
		@Inject(DiToken.FIND_LESSON_BY_ID_HANDLER)
		private readonly findLessonByIdHandler: FindLessonByIdHandler,
		@Inject(DiToken.ADD_LESSON_HANDLER)
		private readonly addLessonHandler: AddLessonHandler,
		@Inject(DiToken.UPDATE_LESSON_HANDLER)
		private readonly updateLessonHandler: UpdateLessonHandler,
		@Inject(DiToken.REORDER_LESSON_HANDLER)
		private readonly reorderLessonHandler: ReorderLessonHandler,
		@Inject(DiToken.REMOVE_LESSON_HANDLER)
		private readonly removeLessonHandler: RemoveLessonHandler,
	) {}

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listLessonsSchema)) payload: z.infer<
			typeof listLessonsSchema
		>,
	): Promise<ListLessonsResponse> {
		try {
			const lessons = await this.listLessonsHandler.execute({
				where: {
					unitId: payload.where?.unitId,
				},
				options: payload.options,
			});

			return {
				lessons: lessons.map(lessonDtoToClient),
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

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findLessonByIdSchema))
		payload: z.infer<typeof findLessonByIdSchema>,
	): Promise<FindLessonByIdResponse> {
		try {
			const lesson = await this.findLessonByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { lesson: lessonDtoToClient(lesson) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
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

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createLessonSchema))
		payload: z.infer<typeof createLessonSchema>,
	): Promise<CreateLessonResponse> {
		try {
			const lesson = await this.addLessonHandler.execute({
				unitId: payload.unitId,
				name: payload.name,
				description: payload.description,
			});

			return { lesson: lessonDtoToClient(lesson) };
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateLessonSchema))
		payload: z.infer<typeof updateLessonSchema>,
	): Promise<UpdateLessonResponse> {
		try {
			const lesson = await this.updateLessonHandler.execute({
				where: { id: payload.where.id },
				props: payload.fields,
			});

			return { lesson: lessonDtoToClient(lesson) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
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

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async reorder(
		@Payload(new RpcValidationPipe(reorderLessonSchema))
		payload: z.infer<typeof reorderLessonSchema>,
	): Promise<void> {
		try {
			await this.reorderLessonHandler.execute({
				lessonId: payload.lessonId,
				order: payload.order,
			});
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
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

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeLessonSchema))
		payload: z.infer<typeof removeLessonSchema>,
	): Promise<void> {
		try {
			await this.removeLessonHandler.execute({
				lessonId: payload.where.id,
			});
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
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
