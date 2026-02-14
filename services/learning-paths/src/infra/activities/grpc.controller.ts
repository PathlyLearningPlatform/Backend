import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import {
	ACTIVITIES_SERVICE_NAME,
	type CreateArticleResponse,
	type CreateExerciseResponse,
	type CreateQuizResponse,
	type FindActivitiesResponse,
	type FindOneActivityResponse,
	type FindOneArticleResponse,
	type FindOneExerciseResponse,
	type FindOneQuizResponse,
	type RemoveActivityResponse,
	type UpdateArticleResponse,
	type UpdateExerciseResponse,
	type UpdateQuizResponse,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import type z from 'zod';
import type {
	CreateArticleUseCase,
	CreateExerciseUseCase,
	CreateQuizUseCase,
	FindActivitiesUseCase,
	FindOneActivityUseCase,
	FindOneArticleUseCase,
	FindOneExerciseUseCase,
	FindOneQuizUseCase,
	RemoveActivityUseCase,
	UpdateArticleUseCase,
	UpdateExerciseUseCase,
	UpdateQuizUseCase,
} from '@/app/activities/use-cases';
import {
	ActivityNotFoundException,
	ActivityOrderException,
} from '@/domain/activities/exceptions';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { DiToken } from '../common/enums';
import { errorCodeToMessage } from '../common/helpers/error-code-to-message.helper';
import {
	activityEntityToClient,
	articleEntityToClient,
	exerciseEntityToClient,
	quizEntityToClient,
} from './helpers';
import {
	createArticleSchema,
	createExerciseSchema,
	createQuizSchema,
	findActivitiesSchema,
	findOneActivitySchema,
	removeActivitySchema,
	updateArticleSchema,
	updateExerciseSchema,
	updateQuizSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcActivitiesController {
	constructor(
		@Inject(DiToken.FIND_ACTIVITIES_USE_CASE)
		private readonly findActivitiesUseCase: FindActivitiesUseCase,
		@Inject(DiToken.FIND_ONE_ACTIVITY_USE_CASE)
		private readonly findOneActivityUseCase: FindOneActivityUseCase,
		@Inject(DiToken.FIND_ONE_ARTICLE_USE_CASE)
		private readonly findOneArticleUseCase: FindOneArticleUseCase,
		@Inject(DiToken.FIND_ONE_EXERCISE_USE_CASE)
		private readonly findOneExerciseUseCase: FindOneExerciseUseCase,
		@Inject(DiToken.FIND_ONE_QUIZ_USE_CASE)
		private readonly findOneQuizUseCase: FindOneQuizUseCase,
		@Inject(DiToken.CREATE_ARTICLE_USE_CASE)
		private readonly createArticleUseCase: CreateArticleUseCase,
		@Inject(DiToken.CREATE_EXERCISE_USE_CASE)
		private readonly createExerciseUseCase: CreateExerciseUseCase,
		@Inject(DiToken.CREATE_QUIZ_USE_CASE)
		private readonly createQuizUseCase: CreateQuizUseCase,
		@Inject(DiToken.UPDATE_ARTICLE_USE_CASE)
		private readonly updateArticleUseCase: UpdateArticleUseCase,
		@Inject(DiToken.UPDATE_EXERCISE_USE_CASE)
		private readonly updateExerciseUseCase: UpdateExerciseUseCase,
		@Inject(DiToken.UPDATE_QUIZ_USE_CASE)
		private readonly updateQuizUseCase: UpdateQuizUseCase,
		@Inject(DiToken.REMOVE_ACTIVITY_USE_CASE)
		private readonly removeActivityUseCase: RemoveActivityUseCase,
	) {}

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async find(
		@Payload(new RpcValidationPipe(findActivitiesSchema)) payload: z.infer<
			typeof findActivitiesSchema
		>,
	): Promise<FindActivitiesResponse> {
		try {
			const activities = await this.findActivitiesUseCase.execute(payload);

			return { activities: activities.map(activityEntityToClient) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findOne(
		@Payload(new RpcValidationPipe(findOneActivitySchema))
		payload: z.infer<typeof findOneActivitySchema>,
	): Promise<FindOneActivityResponse> {
		try {
			const activity = await this.findOneActivityUseCase.execute(
				payload.where.id,
			);

			return { activity: activityEntityToClient(activity) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findOneArticle(
		@Payload(new RpcValidationPipe(findOneActivitySchema))
		payload: z.infer<typeof findOneActivitySchema>,
	): Promise<FindOneArticleResponse> {
		try {
			const article = await this.findOneArticleUseCase.execute(
				payload.where.id,
			);

			return { article: articleEntityToClient(article) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findOneExercise(
		@Payload(new RpcValidationPipe(findOneActivitySchema))
		payload: z.infer<typeof findOneActivitySchema>,
	): Promise<FindOneExerciseResponse> {
		try {
			const exercise = await this.findOneExerciseUseCase.execute(
				payload.where.id,
			);

			return { exercise: exerciseEntityToClient(exercise) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findOneQuiz(
		@Payload(new RpcValidationPipe(findOneActivitySchema))
		payload: z.infer<typeof findOneActivitySchema>,
	): Promise<FindOneQuizResponse> {
		try {
			const quiz = await this.findOneQuizUseCase.execute(payload.where.id);

			return { quiz: quizEntityToClient(quiz) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createArticle(
		@Payload(new RpcValidationPipe(createArticleSchema))
		payload: z.infer<typeof createArticleSchema>,
	): Promise<CreateArticleResponse> {
		try {
			const article = await this.createArticleUseCase.execute(payload);

			return { article: articleEntityToClient(article) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.LESSON_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createExercise(
		@Payload(new RpcValidationPipe(createExerciseSchema))
		payload: z.infer<typeof createExerciseSchema>,
	): Promise<CreateExerciseResponse> {
		try {
			const exercise = await this.createExerciseUseCase.execute(payload);

			return { exercise: exerciseEntityToClient(exercise) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.LESSON_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createQuiz(
		@Payload(new RpcValidationPipe(createQuizSchema))
		payload: z.infer<typeof createQuizSchema>,
	): Promise<CreateQuizResponse> {
		try {
			const quiz = await this.createQuizUseCase.execute(payload);

			return { quiz: quizEntityToClient(quiz) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.LESSON_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateArticle(
		@Payload(new RpcValidationPipe(updateArticleSchema))
		payload: z.infer<typeof updateArticleSchema>,
	): Promise<UpdateArticleResponse> {
		try {
			const article = await this.updateArticleUseCase.execute(payload);

			return { article: articleEntityToClient(article) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.LESSON_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateExercise(
		@Payload(new RpcValidationPipe(updateExerciseSchema))
		payload: z.infer<typeof updateExerciseSchema>,
	): Promise<UpdateExerciseResponse> {
		try {
			const exercise = await this.updateExerciseUseCase.execute(payload);

			return { exercise: exerciseEntityToClient(exercise) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.LESSON_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateQuiz(
		@Payload(new RpcValidationPipe(updateQuizSchema))
		payload: z.infer<typeof updateQuizSchema>,
	): Promise<UpdateQuizResponse> {
		try {
			const quiz = await this.updateQuizUseCase.execute(payload);

			return { quiz: quizEntityToClient(quiz) };
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.LESSON_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
					),
				);
			}
			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
				);
			}

			if (err instanceof ActivityOrderException) {
				throw new GrpcException(
					new GrpcErrorDto(
						err.message,
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER,
					),
					err,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeActivitySchema))
		payload: z.infer<typeof removeActivitySchema>,
	): Promise<RemoveActivityResponse> {
		try {
			await this.removeActivityUseCase.execute(payload.where.id);

			return {};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
					),
					err,
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
