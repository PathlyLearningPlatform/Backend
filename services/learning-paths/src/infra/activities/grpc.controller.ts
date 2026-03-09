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
	type ListActivitiesResponse,
	type ListArticlesResponse,
	type ListExercisesResponse,
	type ListQuizzesResponse,
	type FindActivityByIdResponse,
	type FindArticleByIdResponse,
	type FindExerciseByIdResponse,
	type FindQuizByIdResponse,
	type CreateArticleResponse,
	type CreateExerciseResponse,
	type CreateQuizResponse,
	type UpdateArticleResponse,
	type UpdateExerciseResponse,
	type UpdateQuizResponse,
	type FindQuestionByIdResponse,
	type CreateQuestionResponse,
	type UpdateQuestionResponse,
	ACTIVITIES_SERVICE_NAME,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import type z from 'zod';
import type {
	AddArticleHandler,
	AddExerciseHandler,
	AddQuizHandler,
	ReorderActivityHandler,
} from '@/app/lessons/commands';
import type {
	UpdateArticleHandler,
	UpdateExerciseHandler,
	RemoveActivityHandler,
	AddQuestionHandler,
	RemoveQuestionHandler,
	ReorderQuestionHandler,
} from '@/app/activities/commands';
import type {
	ListActivitiesHandler,
	ListArticlesHandler,
	ListExercisesHandler,
	ListQuizzesHandler,
	FindActivityByIdHandler,
	FindArticleByIdHandler,
	FindExerciseByIdHandler,
	FindQuizByIdHandler,
} from '@/app/activities/queries';
import {
	LessonNotFoundException,
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/app/common';
import type { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { DiToken, ExceptionMessage } from '../common/enums';
import {
	activityDtoToClient,
	articleDtoToClient,
	exerciseDtoToClient,
	quizDtoToClient,
	quizWithoutQuestionsDtoToClient,
	questionDtoToClient,
} from './helpers';
import {
	listActivitiesSchema,
	findActivityByIdSchema,
	createArticleSchema,
	createExerciseSchema,
	createQuizSchema,
	updateArticleSchema,
	updateExerciseSchema,
	updateQuizSchema,
	reorderActivitySchema,
	removeActivitySchema,
	findQuestionByIdSchema,
	createQuestionSchema,
	updateQuestionSchema,
	reorderQuestionSchema,
	removeQuestionSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcActivitiesController {
	constructor(
		@Inject(DiToken.LIST_ACTIVITIES_HANDLER)
		private readonly listActivitiesHandler: ListActivitiesHandler,
		@Inject(DiToken.LIST_ARTICLES_HANDLER)
		private readonly listArticlesHandler: ListArticlesHandler,
		@Inject(DiToken.LIST_EXERCISES_HANDLER)
		private readonly listExercisesHandler: ListExercisesHandler,
		@Inject(DiToken.LIST_QUIZZES_HANDLER)
		private readonly listQuizzesHandler: ListQuizzesHandler,
		@Inject(DiToken.FIND_ACTIVITY_BY_ID_HANDLER)
		private readonly findActivityByIdHandler: FindActivityByIdHandler,
		@Inject(DiToken.FIND_ARTICLE_BY_ID_HANDLER)
		private readonly findArticleByIdHandler: FindArticleByIdHandler,
		@Inject(DiToken.FIND_EXERCISE_BY_ID_HANDLER)
		private readonly findExerciseByIdHandler: FindExerciseByIdHandler,
		@Inject(DiToken.FIND_QUIZ_BY_ID_HANDLER)
		private readonly findQuizByIdHandler: FindQuizByIdHandler,
		@Inject(DiToken.ADD_ARTICLE_HANDLER)
		private readonly addArticleHandler: AddArticleHandler,
		@Inject(DiToken.ADD_EXERCISE_HANDLER)
		private readonly addExerciseHandler: AddExerciseHandler,
		@Inject(DiToken.ADD_QUIZ_HANDLER)
		private readonly addQuizHandler: AddQuizHandler,
		@Inject(DiToken.UPDATE_ARTICLE_HANDLER)
		private readonly updateArticleHandler: UpdateArticleHandler,
		@Inject(DiToken.UPDATE_EXERCISE_HANDLER)
		private readonly updateExerciseHandler: UpdateExerciseHandler,
		@Inject(DiToken.REORDER_ACTIVITY_HANDLER)
		private readonly reorderActivityHandler: ReorderActivityHandler,
		@Inject(DiToken.REMOVE_ACTIVITY_HANDLER)
		private readonly removeActivityHandler: RemoveActivityHandler,
		@Inject(DiToken.ADD_QUESTION_HANDLER)
		private readonly addQuestionHandler: AddQuestionHandler,
		@Inject(DiToken.REORDER_QUESTION_HANDLER)
		private readonly reorderQuestionHandler: ReorderQuestionHandler,
		@Inject(DiToken.REMOVE_QUESTION_HANDLER)
		private readonly removeQuestionHandler: RemoveQuestionHandler,
	) {}

	// ──────────────────────────────────────────────
	// List
	// ──────────────────────────────────────────────

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listActivitiesSchema)) payload: z.infer<
			typeof listActivitiesSchema
		>,
	): Promise<ListActivitiesResponse> {
		try {
			const activities = await this.listActivitiesHandler.execute({
				where: { lessonId: payload.where?.lessonId },
				options: payload.options,
			});

			return { activities: activities.map(activityDtoToClient) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async listArticles(
		@Payload(new RpcValidationPipe(listActivitiesSchema)) payload: z.infer<
			typeof listActivitiesSchema
		>,
	): Promise<ListArticlesResponse> {
		try {
			const articles = await this.listArticlesHandler.execute({
				where: { lessonId: payload.where?.lessonId },
				options: payload.options,
			});

			return { articles: articles.map(articleDtoToClient) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async listExercises(
		@Payload(new RpcValidationPipe(listActivitiesSchema)) payload: z.infer<
			typeof listActivitiesSchema
		>,
	): Promise<ListExercisesResponse> {
		try {
			const exercises = await this.listExercisesHandler.execute({
				where: { lessonId: payload.where?.lessonId },
				options: payload.options,
			});

			return { exercises: exercises.map(exerciseDtoToClient) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async listQuizzes(
		@Payload(new RpcValidationPipe(listActivitiesSchema)) payload: z.infer<
			typeof listActivitiesSchema
		>,
	): Promise<ListQuizzesResponse> {
		try {
			const quizzes = await this.listQuizzesHandler.execute({
				where: { lessonId: payload.where?.lessonId },
				options: payload.options,
			});

			return {
				quizzes: quizzes.map(quizWithoutQuestionsDtoToClient),
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

	// ──────────────────────────────────────────────
	// Find by ID
	// ──────────────────────────────────────────────

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findActivityByIdSchema))
		payload: z.infer<typeof findActivityByIdSchema>,
	): Promise<FindActivityByIdResponse> {
		try {
			const activity = await this.findActivityByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { activity: activityDtoToClient(activity) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findArticleById(
		@Payload(new RpcValidationPipe(findActivityByIdSchema))
		payload: z.infer<typeof findActivityByIdSchema>,
	): Promise<FindArticleByIdResponse> {
		try {
			const article = await this.findArticleByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { article: articleDtoToClient(article) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findExerciseById(
		@Payload(new RpcValidationPipe(findActivityByIdSchema))
		payload: z.infer<typeof findActivityByIdSchema>,
	): Promise<FindExerciseByIdResponse> {
		try {
			const exercise = await this.findExerciseByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { exercise: exerciseDtoToClient(exercise) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findQuizById(
		@Payload(new RpcValidationPipe(findActivityByIdSchema))
		payload: z.infer<typeof findActivityByIdSchema>,
	): Promise<FindQuizByIdResponse> {
		try {
			const quiz = await this.findQuizByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { quiz: quizDtoToClient(quiz) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	// ──────────────────────────────────────────────
	// Create
	// ──────────────────────────────────────────────

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createArticle(
		@Payload(new RpcValidationPipe(createArticleSchema))
		payload: z.infer<typeof createArticleSchema>,
	): Promise<CreateArticleResponse> {
		try {
			const article = await this.addArticleHandler.execute({
				lessonId: payload.lessonId,
				name: payload.name,
				description: payload.description,
				ref: payload.ref,
			});

			return { article: articleDtoToClient(article) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createExercise(
		@Payload(new RpcValidationPipe(createExerciseSchema))
		payload: z.infer<typeof createExerciseSchema>,
	): Promise<CreateExerciseResponse> {
		try {
			const exercise = await this.addExerciseHandler.execute({
				lessonId: payload.lessonId,
				name: payload.name,
				description: payload.description,
				difficulty: payload.difficulty as ExerciseDifficulty,
			});

			return { exercise: exerciseDtoToClient(exercise) };
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createQuiz(
		@Payload(new RpcValidationPipe(createQuizSchema))
		payload: z.infer<typeof createQuizSchema>,
	): Promise<CreateQuizResponse> {
		try {
			const quiz = await this.addQuizHandler.execute({
				lessonId: payload.lessonId,
				name: payload.name,
				description: payload.description,
			});

			return { quiz: quizWithoutQuestionsDtoToClient(quiz) };
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

	// ──────────────────────────────────────────────
	// Update
	// ──────────────────────────────────────────────

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateArticle(
		@Payload(new RpcValidationPipe(updateArticleSchema))
		payload: z.infer<typeof updateArticleSchema>,
	): Promise<UpdateArticleResponse> {
		try {
			const article = await this.updateArticleHandler.execute({
				where: { id: payload.where.activityId },
				props: payload.fields,
			});

			return { article: articleDtoToClient(article) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateExercise(
		@Payload(new RpcValidationPipe(updateExerciseSchema))
		payload: z.infer<typeof updateExerciseSchema>,
	): Promise<UpdateExerciseResponse> {
		try {
			const exercise = await this.updateExerciseHandler.execute({
				where: { id: payload.where.activityId },
				props: payload.fields
					? {
							...payload.fields,
							difficulty: payload.fields.difficulty as
								| ExerciseDifficulty
								| undefined,
						}
					: undefined,
			});

			return { exercise: exerciseDtoToClient(exercise) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateQuiz(
		@Payload(new RpcValidationPipe(updateQuizSchema))
		payload: z.infer<typeof updateQuizSchema>,
	): Promise<UpdateQuizResponse> {
		try {
			// updateQuiz is not yet implemented in app layer
			// For now, treat as activity not found
			throw new ActivityNotFoundException(payload.where.activityId);
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	// ──────────────────────────────────────────────
	// Reorder / Remove
	// ──────────────────────────────────────────────

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async reorder(
		@Payload(new RpcValidationPipe(reorderActivitySchema))
		payload: z.infer<typeof reorderActivitySchema>,
	): Promise<void> {
		try {
			await this.reorderActivityHandler.execute({
				activityId: payload.activityId,
				order: payload.order,
			});
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeActivitySchema))
		payload: z.infer<typeof removeActivitySchema>,
	): Promise<void> {
		try {
			await this.removeActivityHandler.execute({
				activityId: payload.where.id,
			});
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	// ──────────────────────────────────────────────
	// Questions
	// ──────────────────────────────────────────────

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async findQuestionById(
		@Payload(new RpcValidationPipe(findQuestionByIdSchema))
		payload: z.infer<typeof findQuestionByIdSchema>,
	): Promise<FindQuestionByIdResponse> {
		try {
			const quiz = await this.findQuizByIdHandler.execute({
				where: { id: payload.where.quizId },
			});

			const question = quiz.questions.find((q) => q.id === payload.where.id);

			if (!question) {
				throw new QuestionNotFoundException(payload.where.id);
			}

			return { question: questionDtoToClient(question) };
		} catch (err) {
			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async createQuestion(
		@Payload(new RpcValidationPipe(createQuestionSchema))
		payload: z.infer<typeof createQuestionSchema>,
	): Promise<CreateQuestionResponse> {
		try {
			const question = await this.addQuestionHandler.execute({
				quizId: payload.quizId,
				content: payload.content,
				correctAnswer: payload.correctAnswer,
			});

			return { question: questionDtoToClient(question) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async updateQuestion(
		@Payload(new RpcValidationPipe(updateQuestionSchema))
		payload: z.infer<typeof updateQuestionSchema>,
	): Promise<UpdateQuestionResponse> {
		try {
			// updateQuestion handler is not yet implemented in app layer
			throw new QuestionNotFoundException(payload.where.id);
		} catch (err) {
			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async reorderQuestion(
		@Payload(new RpcValidationPipe(reorderQuestionSchema))
		payload: z.infer<typeof reorderQuestionSchema>,
	): Promise<void> {
		try {
			await this.reorderQuestionHandler.execute({
				quizId: payload.quizId,
				questionId: payload.questionId,
				order: payload.order,
			});
		} catch (err) {
			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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

	@GrpcMethod(ACTIVITIES_SERVICE_NAME)
	async removeQuestion(
		@Payload(new RpcValidationPipe(removeQuestionSchema))
		payload: z.infer<typeof removeQuestionSchema>,
	): Promise<void> {
		try {
			await this.removeQuestionHandler.execute({
				quizId: payload.where.quizId,
				questionId: payload.where.id,
			});
		} catch (err) {
			if (err instanceof QuestionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.QUESTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.QUESTION_NOT_FOUND,
					),
				);
			}

			if (err instanceof ActivityNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.ACTIVITY_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND,
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
