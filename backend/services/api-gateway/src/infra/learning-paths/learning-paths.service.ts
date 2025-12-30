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
	LEARNING_PATHS_V1_PACKAGE_NAME,
	type LearningPathsServiceClient,
	type RemoveLearningPathRequest,
	type RemoveLearningPathResponse,
	type UpdateLearningPathRequest,
	type UpdateLearningPathResponse,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class LearningPathsService implements OnModuleInit {
	private pathsServiceClient: LearningPathsServiceClient

	constructor(
		@Inject(DiToken.LEARNING_PATHS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.pathsServiceClient =
			this.client.getService<LearningPathsServiceClient>(
				LEARNING_PATHS_SERVICE_NAME,
			)
	}

	async find(
		request: FindLearningPathsRequest,
	): Promise<FindLearningPathsResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.find(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findOne(
		request: FindOneLearningPathRequest,
	): Promise<FindOneLearningPathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.findOne(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async create(
		request: CreateLearningPathRequest,
	): Promise<CreateLearningPathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(
		request: UpdateLearningPathRequest,
	): Promise<UpdateLearningPathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(
		request: RemoveLearningPathRequest,
	): Promise<RemoveLearningPathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}
