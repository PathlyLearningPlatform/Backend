import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	ACTIVITIES_SERVICE_NAME,
	CreateQuestionRequest,
	CreateQuestionResponse,
	FindOneQuestionRequest,
	FindOneQuestionResponse,
	FindQuestionsRequest,
	FindQuestionsResponse,
	RemoveQuestionRequest,
	RemoveQuestionResponse,
	UpdateQuestionRequest,
	UpdateQuestionResponse,
	type ActivitiesServiceClient,
	type CreateArticleRequest,
	type CreateArticleResponse,
	type CreateExerciseRequest,
	type CreateExerciseResponse,
	type CreateQuizRequest,
	type CreateQuizResponse,
	type FindActivitiesRequest,
	type FindActivitiesResponse,
	type FindOneActivityRequest,
	type FindOneActivityResponse,
	type FindOneArticleResponse,
	type FindOneExerciseResponse,
	type FindOneQuizResponse,
	type RemoveActivityRequest,
	type UpdateArticleRequest,
	type UpdateArticleResponse,
	type UpdateExerciseRequest,
	type UpdateExerciseResponse,
	type UpdateQuizRequest,
	type UpdateQuizResponse,
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

	async find(request: FindActivitiesRequest): Promise<FindActivitiesResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.find(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findOne(
		request: FindOneActivityRequest,
	): Promise<FindOneActivityResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findOne(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async findOneArticle(
		request: FindOneActivityRequest,
	): Promise<FindOneArticleResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findOneArticle(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async findOneExercise(
		request: FindOneActivityRequest,
	): Promise<FindOneExerciseResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findOneExercise(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async findOneQuiz(
		request: FindOneActivityRequest,
	): Promise<FindOneQuizResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.findOneQuiz(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async createArticle(
		request: CreateArticleRequest,
	): Promise<CreateArticleResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createArticle(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async createExercise(
		request: CreateExerciseRequest,
	): Promise<CreateExerciseResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createExercise(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async createQuiz(request: CreateQuizRequest): Promise<CreateQuizResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.createQuiz(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async updateArticle(
		request: UpdateArticleRequest,
	): Promise<UpdateArticleResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateArticle(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async updateExercise(
		request: UpdateExerciseRequest,
	): Promise<UpdateExerciseResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateExercise(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async updateQuiz(request: UpdateQuizRequest): Promise<UpdateQuizResponse> {
		const result = await firstValueFrom(
			this.activitiesServiceClient
				.updateQuiz(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async remove(request: RemoveActivityRequest): Promise<void> {
		await firstValueFrom(
			this.activitiesServiceClient
				.remove(request)
				.pipe(catchError(throwGrpcException)),
		)
	}

	async findQuestions(
		request: FindQuestionsRequest,
	): Promise<FindQuestionsResponse> {
		return await firstValueFrom(
			this.activitiesServiceClient
				.findQuestions(request)
				.pipe(catchError(throwGrpcException)),
		)
	}

	async findOneQuestion(
		request: FindOneQuestionRequest,
	): Promise<FindOneQuestionResponse> {
		return await firstValueFrom(
			this.activitiesServiceClient
				.findOneQuestion(request)
				.pipe(catchError(throwGrpcException)),
		)
	}

	async createQuestion(
		request: CreateQuestionRequest,
	): Promise<CreateQuestionResponse> {
		return await firstValueFrom(
			this.activitiesServiceClient
				.createQuestion(request)
				.pipe(catchError(throwGrpcException)),
		)
	}

	async updateQuestion(
		request: UpdateQuestionRequest,
	): Promise<UpdateQuestionResponse> {
		return await firstValueFrom(
			this.activitiesServiceClient
				.updateQuestion(request)
				.pipe(catchError(throwGrpcException)),
		)
	}

	async removeQuestion(
		request: RemoveQuestionRequest,
	): Promise<RemoveQuestionResponse> {
		return await firstValueFrom(
			this.activitiesServiceClient
				.removeQuestion(request)
				.pipe(catchError(throwGrpcException)),
		)
	}
}
