import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/nestjs/helpers/throw-grpc-exception.helper.js'
import {
	type CreateUnitRequest,
	type CreateUnitResponse,
	type FindOneUnitRequest,
	type FindOneUnitResponse,
	type FindUnitsRequest,
	type FindUnitsResponse,
	type RemoveUnitRequest,
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

	async find(request: FindUnitsRequest): Promise<FindUnitsResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.find(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findOne(request: FindOneUnitRequest): Promise<FindOneUnitResponse> {
		const result = await firstValueFrom(
			this.unitsServiceClient
				.findOne(request)
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

	async remove(request: RemoveUnitRequest): Promise<void> {
		await firstValueFrom(
			this.unitsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)
	}
}
