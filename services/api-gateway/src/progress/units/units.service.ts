import { DiToken } from '@/common/enums'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	UNIT_PROGRESS_SERVICE_NAME,
	type FindUnitProgressByIdRequest,
	type FindUnitProgressByIdResponse,
	type FindUnitProgressForUserRequest,
	type FindUnitProgressForUserResponse,
	type ListUnitProgressRequest,
	type ListUnitProgressResponse,
	type RemoveUnitProgressRequest,
	type RemoveUnitProgressResponse,
	type StartUnitRequest,
	type StartUnitResponse,
	type UnitProgressServiceClient,
} from '@pathly-backend/contracts/progress/v1/units.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class UnitProgressService implements OnModuleInit {
	private unitProgressServiceClient!: UnitProgressServiceClient

	constructor(@Inject(DiToken.UNIT_PROGRESS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.unitProgressServiceClient =
			this.client.getService<UnitProgressServiceClient>(UNIT_PROGRESS_SERVICE_NAME)
	}

	async list(request: ListUnitProgressRequest): Promise<ListUnitProgressResponse> {
		const result = await firstValueFrom(
			this.unitProgressServiceClient
				.list(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findById(
		request: FindUnitProgressByIdRequest,
	): Promise<FindUnitProgressByIdResponse> {
		const result = await firstValueFrom(
			this.unitProgressServiceClient
				.findById(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findForUser(
		request: FindUnitProgressForUserRequest,
	): Promise<FindUnitProgressForUserResponse> {
		const result = await firstValueFrom(
			this.unitProgressServiceClient
				.findForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async start(request: StartUnitRequest): Promise<StartUnitResponse> {
		const result = await firstValueFrom(
			this.unitProgressServiceClient
				.start(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async remove(
		request: RemoveUnitProgressRequest,
	): Promise<RemoveUnitProgressResponse> {
		const result = await firstValueFrom(
			this.unitProgressServiceClient
				.remove(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
}
