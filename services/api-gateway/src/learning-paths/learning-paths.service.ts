import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	type CreateLearningPathRequest,
	type CreateLearningPathResponse,
	type FindLearningPathsRequest,
	type FindLearningPathsResponse,
	type FindOneLearningPathRequest,
	type FindOneLearningPathResponse,
	LEARNING_PATHS_SERVICE_NAME,
	type LearningPathsServiceClient,
	type RemoveLearningPathRequest,
	type UpdateLearningPathRequest,
	type UpdateLearningPathResponse,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class LearningPathsService implements OnModuleInit {
	private learningPathsServiceClient: LearningPathsServiceClient

	constructor(
		@Inject(DiToken.LEARNING_PATHS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.learningPathsServiceClient =
			this.client.getService<LearningPathsServiceClient>(
				LEARNING_PATHS_SERVICE_NAME,
			)
	}

	async find(
		request: FindLearningPathsRequest,
	): Promise<FindLearningPathsResponse> {
		const result = await firstValueFrom(
			this.learningPathsServiceClient
				.find(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findOne(
		request: FindOneLearningPathRequest,
	): Promise<FindOneLearningPathResponse> {
		const result = await firstValueFrom(
			this.learningPathsServiceClient
				.findOne(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async create(
		request: CreateLearningPathRequest,
	): Promise<CreateLearningPathResponse> {
		const result = await firstValueFrom(
			this.learningPathsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(
		request: UpdateLearningPathRequest,
	): Promise<UpdateLearningPathResponse> {
		const result = await firstValueFrom(
			this.learningPathsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(request: RemoveLearningPathRequest): Promise<void> {
		await firstValueFrom(
			this.learningPathsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)
	}
}
