import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	ACTIVITIES_SERVICE_NAME,
	type ActivitiesServiceClient,
	type ListActivitiesRequest,
	type ListActivitiesResponse,
	type ListArticlesResponse,
	type ListExercisesResponse,
	type ListQuizzesResponse,
	type FindActivityByIdRequest,
	type FindActivityByIdResponse,
	type FindArticleByIdResponse,
	type FindExerciseByIdResponse,
	type FindQuizByIdResponse,
	type CreateArticleRequest,
	type CreateArticleResponse,
	type CreateExerciseRequest,
	type CreateExerciseResponse,
	type CreateQuizRequest,
	type CreateQuizResponse,
	type UpdateArticleRequest,
	type UpdateArticleResponse,
	type UpdateExerciseRequest,
	type UpdateExerciseResponse,
	type UpdateQuizRequest,
	type UpdateQuizResponse,
	type ReorderActivityRequest,
	type ReorderActivityResponse,
	type RemoveActivityRequest,
	type RemoveActivityResponse,
	type FindQuestionByIdRequest,
	type FindQuestionByIdResponse,
	type CreateQuestionRequest,
	type CreateQuestionResponse,
	type UpdateQuestionRequest,
	type UpdateQuestionResponse,
	type ReorderQuestionRequest,
	type ReorderQuestionResponse,
	type RemoveQuestionRequest,
	type RemoveQuestionResponse,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class ActivitiesService implements OnModuleInit {
	private activitiesServiceClient: ActivitiesServiceClient

	constructor(@Inject(DiToken.ACTIVITIES_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.activitiesServiceClient =
			this.client.getService<ActivitiesServiceClient>(ACTIVITIES_SERVICE_NAME)
	}

	// ──────────────────────────────────────────────
	// List
	// ──────────────────────────────────────────────

	async list(request: ListActivitiesRequest): Promise<ListActivitiesResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.list(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async listArticles(request: ListActivitiesRequest): Promise<ListArticlesResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.listArticles(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async listExercises(request: ListActivitiesRequest): Promise<ListExercisesResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.listExercises(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async listQuizzes(request: ListActivitiesRequest): Promise<ListQuizzesResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.listQuizzes(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	// ──────────────────────────────────────────────
	// Find by ID
	// ──────────────────────────────────────────────

	async findById(request: FindActivityByIdRequest): Promise<FindActivityByIdResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findArticleById(request: FindActivityByIdRequest): Promise<FindArticleByIdResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findArticleById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findExerciseById(request: FindActivityByIdRequest): Promise<FindExerciseByIdResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findExerciseById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findQuizById(request: FindActivityByIdRequest): Promise<FindQuizByIdResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findQuizById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	// ──────────────────────────────────────────────
	// Create
	// ──────────────────────────────────────────────

	async createArticle(request: CreateArticleRequest): Promise<CreateArticleResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createArticle(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async createExercise(request: CreateExerciseRequest): Promise<CreateExerciseResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createExercise(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async createQuiz(request: CreateQuizRequest): Promise<CreateQuizResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createQuiz(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	// ──────────────────────────────────────────────
	// Update
	// ──────────────────────────────────────────────

	async updateArticle(request: UpdateArticleRequest): Promise<UpdateArticleResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateArticle(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async updateExercise(request: UpdateExerciseRequest): Promise<UpdateExerciseResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateExercise(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async updateQuiz(request: UpdateQuizRequest): Promise<UpdateQuizResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateQuiz(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	// ──────────────────────────────────────────────
	// Reorder / Remove
	// ──────────────────────────────────────────────

	async reorder(request: ReorderActivityRequest): Promise<ReorderActivityResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.reorder(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(request: RemoveActivityRequest): Promise<RemoveActivityResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	// ──────────────────────────────────────────────
	// Questions
	// ──────────────────────────────────────────────

	async findQuestionById(request: FindQuestionByIdRequest): Promise<FindQuestionByIdResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findQuestionById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async createQuestion(request: CreateQuestionRequest): Promise<CreateQuestionResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createQuestion(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async updateQuestion(request: UpdateQuestionRequest): Promise<UpdateQuestionResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateQuestion(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async reorderQuestion(request: ReorderQuestionRequest): Promise<ReorderQuestionResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.reorderQuestion(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async removeQuestion(request: RemoveQuestionRequest): Promise<RemoveQuestionResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.removeQuestion(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}
