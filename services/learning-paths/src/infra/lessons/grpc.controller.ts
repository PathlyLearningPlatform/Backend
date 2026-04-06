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
	LessonsServiceFindOneProgressForUserResponse,
	LessonsServiceListProgressResponse,
	LessonsServiceRemoveProgressResponse,
	LessonsServiceStartResponse,
} from '@pathly-backend/contracts/learning_paths/v1/lessons.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateLessonResponse,
	type FindLessonByIdResponse,
	LESSONS_SERVICE_NAME,
	type ListLessonsResponse,
	type UpdateLessonResponse,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import type z from 'zod';
import { LessonNotFoundException, UnitNotFoundException } from '@/app/common';
import type {
	RemoveLessonHandler,
	RemoveLessonProgressHandler,
	StartLessonHandler,
	UpdateLessonHandler,
} from '@/app/lessons/commands';
import { LessonProgressNotFoundException } from '@/app/lessons/exceptions';
import type {
	FindLessonByIdHandler,
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
	ListLessonsHandler,
} from '@/app/lessons/queries';
import type {
	AddLessonHandler,
	ReorderLessonHandler,
} from '@/app/units/commands';
import { DiToken, ExceptionMessage } from '../common/enums';
import { lessonDtoToClient, lessonProgressDtoToClient } from './helpers';
import {
	createLessonSchema,
	findLessonByIdSchema,
	findLessonProgressForUserSchema,
	listLessonProgressSchema,
	listLessonsSchema,
	removeLessonProgressSchema,
	removeLessonSchema,
	reorderLessonSchema,
	startLessonSchema,
	updateLessonSchema,
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
		@Inject(DiToken.START_LESSON_HANDLER)
		private readonly startLessonHandler: StartLessonHandler,
		@Inject(DiToken.REMOVE_LESSON_PROGRESS_HANDLER)
		private readonly removeLessonProgressHandler: RemoveLessonProgressHandler,
		@Inject(DiToken.FIND_LESSON_PROGRESS_FOR_USER_HANDLER)
		private readonly findLessonProgressForUserHandler: FindLessonProgressForUserHandler,
		@Inject(DiToken.LIST_LESSON_PROGRESS_HANDLER)
		private readonly listLessonProgressHandler: ListLessonProgressHandler,
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

	@GrpcMethod(LESSONS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startLessonSchema))
		payload: z.infer<typeof startLessonSchema>,
	): Promise<LessonsServiceStartResponse> {
		try {
			const progress = await this.startLessonHandler.execute({
				lessonId: payload.lessonId,
				userId: payload.userId,
			});

			return {
				progress: lessonProgressDtoToClient(progress),
			};
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
	async removeProgress(
		@Payload(new RpcValidationPipe(removeLessonProgressSchema))
		payload: z.infer<typeof removeLessonProgressSchema>,
	): Promise<LessonsServiceRemoveProgressResponse> {
		try {
			await this.removeLessonProgressHandler.execute({
				lessonId: payload.lessonId,
				userId: payload.userId,
			});

			return {};
		} catch (err) {
			if (err instanceof LessonProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_PROGRESS_NOT_FOUND,
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
	async findOneProgressForUser(
		@Payload(new RpcValidationPipe(findLessonProgressForUserSchema))
		payload: z.infer<typeof findLessonProgressForUserSchema>,
	): Promise<LessonsServiceFindOneProgressForUserResponse> {
		try {
			const progress = await this.findLessonProgressForUserHandler.execute({
				lessonId: payload.lessonId,
				userId: payload.userId,
			});

			return {
				progress: lessonProgressDtoToClient(progress),
			};
		} catch (err) {
			if (err instanceof LessonProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LESSON_PROGRESS_NOT_FOUND,
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
	async listProgress(
		@Payload(new RpcValidationPipe(listLessonProgressSchema))
		payload: z.infer<typeof listLessonProgressSchema>,
	): Promise<LessonsServiceListProgressResponse> {
		try {
			const progress = await this.listLessonProgressHandler.execute({
				options: payload.options,
				where: {
					unitId: payload.where?.unitId,
					userId: payload.where?.userId,
				},
			});

			return {
				progress: progress.map(lessonProgressDtoToClient),
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
