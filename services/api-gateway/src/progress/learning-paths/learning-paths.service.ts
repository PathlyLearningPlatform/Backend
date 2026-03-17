import { DiToken } from '@/common/enums'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	LEARNING_PATH_PROGRESS_SERVICE_NAME,
	type FindLearningPathProgressByIdRequest,
	type FindLearningPathProgressByIdResponse,
	type FindLearningPathProgressForUserRequest,
	type FindLearningPathProgressForUserResponse,
	type LearningPathProgressServiceClient,
	type ListLearningPathProgressRequest,
	type ListLearningPathProgressResponse,
	type RemoveLearningPathProgressRequest,
	type RemoveLearningPathProgressResponse,
	type StartLearningPathRequest,
	type StartLearningPathResponse,
} from '@pathly-backend/contracts/progress/v1/learning-paths.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class LearningPathProgressService implements OnModuleInit {
	private learningPathProgressServiceClient!: LearningPathProgressServiceClient

	constructor(
		@Inject(DiToken.LEARNING_PATH_PROGRESS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.learningPathProgressServiceClient =
			this.client.getService<LearningPathProgressServiceClient>(
				LEARNING_PATH_PROGRESS_SERVICE_NAME,
			)
	}

	async list(
		request: ListLearningPathProgressRequest,
	): Promise<ListLearningPathProgressResponse> {
		const result = await firstValueFrom(
			this.learningPathProgressServiceClient
				.list(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findById(
		request: FindLearningPathProgressByIdRequest,
	): Promise<FindLearningPathProgressByIdResponse> {
		const result = await firstValueFrom(
			this.learningPathProgressServiceClient
				.findById(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findForUser(
		request: FindLearningPathProgressForUserRequest,
	): Promise<FindLearningPathProgressForUserResponse> {
		const result = await firstValueFrom(
			this.learningPathProgressServiceClient
				.findForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async start(
		request: StartLearningPathRequest,
	): Promise<StartLearningPathResponse> {
		const result = await firstValueFrom(
			this.learningPathProgressServiceClient
				.start(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async remove(
		request: RemoveLearningPathProgressRequest,
	): Promise<RemoveLearningPathProgressResponse> {
		const result = await firstValueFrom(
			this.learningPathProgressServiceClient
				.remove(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
}
