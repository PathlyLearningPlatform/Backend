import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { DiToken } from '../common/enums'
import type { ClientGrpc } from '@nestjs/microservices'
import {
	CreatePathRequest,
	CreatePathResponse,
	FindPathsRequest,
	FindPathsResponse,
	PATHS_SERVICE_NAME,
	PathsServiceClient,
	RemovePathRequest,
	RemovePathResponse,
	UpdatePathRequest,
	UpdatePathResponse,
	FindOnePathRequest,
	FindOnePathResponse,
} from '@pathly-backend/contracts/paths/v1/paths.js'
import { catchError, firstValueFrom } from 'rxjs'
import {
	AppException,
	GrpcErrorDto,
	GrpcException,
} from '@pathly-backend/common'
import { status as GrpcStatus } from '@grpc/grpc-js'
import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from './exceptions'
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js'

@Injectable()
export class PathsService implements OnModuleInit {
	private pathsServiceClient: PathsServiceClient

	constructor(@Inject(DiToken.PATHS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.pathsServiceClient =
			this.client.getService<PathsServiceClient>(PATHS_SERVICE_NAME)
	}

	async find(request: FindPathsRequest): Promise<FindPathsResponse> {
		try {
			const result = await firstValueFrom(
				this.pathsServiceClient.find(request).pipe(
					catchError((err: GrpcErrorDto) => {
						throw new GrpcException(err)
					}),
				),
			)

			return result
		} catch (err) {
			throw new AppException('failed to find one path', true, err)
		}
	}

	async findOne(request: FindOnePathRequest): Promise<FindOnePathResponse> {
		try {
			const result = await firstValueFrom(
				this.pathsServiceClient.findOne(request).pipe(
					catchError((err: GrpcErrorDto) => {
						throw new GrpcException(err)
					}),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getError() as GrpcErrorDto

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new PathNotFoundException(request.where!.id)
				default:
					throw new AppException('failed to find one path', true, err)
			}
		}
	}

	async create(request: CreatePathRequest): Promise<CreatePathResponse> {
		try {
			const result = await firstValueFrom(
				this.pathsServiceClient.create(request).pipe(
					catchError((err: GrpcErrorDto) => {
						throw new GrpcException(err)
					}),
				),
			)

			return result
		} catch (err) {
			throw new AppException('failed to create path', true, err)
		}
	}

	async update(request: UpdatePathRequest): Promise<UpdatePathResponse> {
		try {
			const result = await firstValueFrom(
				this.pathsServiceClient.update(request).pipe(
					catchError((err: GrpcErrorDto) => {
						throw new GrpcException(err)
					}),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getError() as GrpcErrorDto

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new PathNotFoundException(request.where!.id)
				default:
					throw new AppException('failed to update path', true, err)
			}
		}
	}

	async remove(request: RemovePathRequest): Promise<RemovePathResponse> {
		try {
			const result = await firstValueFrom(
				this.pathsServiceClient.remove(request).pipe(
					catchError((err: GrpcErrorDto) => {
						throw new GrpcException(err)
					}),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getError() as GrpcErrorDto

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new PathNotFoundException(request.where!.id)
				case PathsApiErrorCodes.PATH_CANNOT_BE_REMOVED:
					throw new PathCannotBeRemovedException(request.where!.id)
				default:
					throw new AppException('failed to remove path', true, err)
			}
		}
	}
}
