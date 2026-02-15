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
	CreateQuestionResponse,
	FindOneQuestionResponse,
	FindQuestionsResponse,
	RemoveQuestionResponse,
	UpdateQuestionResponse,
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
import z from 'zod';
import type {
	CreateArticleUseCase,
	CreateExerciseUseCase,
	CreateQuestionUseCase,
	CreateQuizUseCase,
	FindActivitiesUseCase,
	FindOneActivityUseCase,
	FindOneArticleUseCase,
	FindOneExerciseUseCase,
	FindOneQuestionUseCase,
	FindOneQuizUseCase,
	FindQuestionsUseCase,
	RemoveActivityUseCase,
	RemoveQuestionUseCase,
	UpdateArticleUseCase,
	UpdateExerciseUseCase,
	UpdateQuestionUseCase,
	UpdateQuizUseCase,
} from '@/app/activities/use-cases';
import {
	ActivityNotFoundException,
	ActivityOrderException,
	QuestionNotFoundException,
} from '@/domain/activities/exceptions';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { DiToken, ExceptionMessage } from '../common/enums';
import { errorCodeToMessage } from '../common/helpers/error-code-to-message.helper';
import {
	activityEntityToClient,
	articleEntityToClient,
	exerciseEntityToClient,
	questionEntityToClient,
	quizEntityToClient,
} from './helpers';
import {
	createArticleSchema,
	createExerciseSchema,
	createQuestionSchema,
	createQuizSchema,
	findActivitiesSchema,
	findOneActivitySchema,
	findOneQuestionSchema,
	findQuestionsSchema,
	removeActivitySchema,
	removeQuestionSchema,
	updateArticleSchema,
	updateExerciseSchema,
	updateQuestionSchema,
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

		@Inject(DiToken.FIND_QUESTIONS_USE_CASE)
		private readonly findQuestionsUseCase: FindQuestionsUseCase,
		@Inject(DiToken.FIND_ONE_QUESTION_USE_CASE)
		private readonly findOneQuestionUseCase: FindOneQuestionUseCase,
		@Inject(DiToken.CREATE_QUESTION_USE_CASE)
		private readonly createQuestionUseCase: CreateQuestionUseCase,
		@Inject(DiToken.UPDATE_QUESTION_USE_CASE)
		private readonly updateQuestionUseCase: UpdateQuestionUseCase,
		@Inject(DiToken.REMOVE_QUESTION_USE_CASE)
		private readonly removeQuestionUseCase: RemoveQuestionUseCase,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findQuestions(
		@Payload(new RpcValidationPipe(findQuestionsSchema)) payload: z.infer<
			typeof findQuestionsSchema
		>,
	): Promise<FindQuestionsResponse> {
		try {
			const questions = await this.findQuestionsUseCase.execute(payload.quizId);

			return { questions: questions.map(questionEntityToClient) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findOneQuestion(
		@Payload(new RpcValidationPipe(findOneQuestionSchema)) payload: z.infer<
			typeof findOneQuestionSchema
		>,
	): Promise<FindOneQuestionResponse> {
		try {
			const question = await this.findOneQuestionUseCase.execute(
				payload.where.quizId,
				payload.where.id,
			);

			return {
				question: questionEntityToClient(question),
			};
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

			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
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
	async createQuestion(
		@Payload(new RpcValidationPipe(createQuestionSchema)) payload: z.infer<
			typeof createQuestionSchema
		>,
	): Promise<CreateQuestionResponse> {
		try {
			const question = await this.createQuestionUseCase.execute(payload);

			return {
				question: questionEntityToClient(question),
			};
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateQuestion(
		@Payload(new RpcValidationPipe(updateQuestionSchema)) payload: z.infer<
			typeof updateQuestionSchema
		>,
	): Promise<UpdateQuestionResponse> {
		try {
			const question = await this.updateQuestionUseCase.execute(payload);

			return {
				question: questionEntityToClient(question),
			};
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

			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
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
	async removeQuestion(
		@Payload(new RpcValidationPipe(removeQuestionSchema)) payload: z.infer<
			typeof removeQuestionSchema
		>,
	): Promise<RemoveQuestionResponse> {
		try {
			await this.removeQuestionUseCase.execute(
				payload.where.quizId,
				payload.where.id,
			);

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

			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
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
