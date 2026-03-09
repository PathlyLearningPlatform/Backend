import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	type CreateUnitRequest,
	type CreateUnitResponse,
	type FindUnitByIdRequest,
	type FindUnitByIdResponse,
	type ListUnitsRequest,
	type ListUnitsResponse,
	type ReorderUnitRequest,
	type ReorderUnitResponse,
	type RemoveUnitRequest,
	type RemoveUnitResponse,
	UNITS_SERVICE_NAME,
	type UnitsServiceClient,
	type UpdateUnitRequest,
	type UpdateUnitResponse,
} from '@pathly-backend/contracts/learning-paths/v1/units.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class UnitsService implements OnModuleInit {
	private unitsServiceClient: UnitsServiceClient

	constructor(@Inject(DiToken.UNITS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.unitsServiceClient =
			this.client.getService<UnitsServiceClient>(UNITS_SERVICE_NAME)
	}

	async list(request: ListUnitsRequest): Promise<ListUnitsResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.list(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findById(request: FindUnitByIdRequest): Promise<FindUnitByIdResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.findById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async create(request: CreateUnitRequest): Promise<CreateUnitResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(request: UpdateUnitRequest): Promise<UpdateUnitResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async reorder(request: ReorderUnitRequest): Promise<ReorderUnitResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.reorder(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(request: RemoveUnitRequest): Promise<RemoveUnitResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}
