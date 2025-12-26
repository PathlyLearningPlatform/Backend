import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	type CreatePathRequest,
	type CreatePathResponse,
	type FindOnePathRequest,
	type FindOnePathResponse,
	type FindPathsRequest,
	type FindPathsResponse,
	PATHS_SERVICE_NAME,
	type PathsServiceClient,
	type RemovePathRequest,
	type RemovePathResponse,
	type UpdatePathRequest,
	type UpdatePathResponse,
} from '@pathly-backend/contracts/paths/v1/paths.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class PathsService implements OnModuleInit {
	private pathsServiceClient: PathsServiceClient

	constructor(@Inject(DiToken.PATHS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.pathsServiceClient =
			this.client.getService<PathsServiceClient>(PATHS_SERVICE_NAME)
	}

	async find(request: FindPathsRequest): Promise<FindPathsResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.find(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findOne(request: FindOnePathRequest): Promise<FindOnePathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.findOne(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async create(request: CreatePathRequest): Promise<CreatePathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(request: UpdatePathRequest): Promise<UpdatePathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(request: RemovePathRequest): Promise<RemovePathResponse> {
		const result = await firstValueFrom(
			this.pathsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}
