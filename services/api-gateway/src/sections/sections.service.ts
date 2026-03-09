import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	type CreateSectionRequest,
	type CreateSectionResponse,
	type FindSectionByIdRequest,
	type FindSectionByIdResponse,
	type ListSectionsRequest,
	type ListSectionsResponse,
	type ReorderSectionRequest,
	type ReorderSectionResponse,
	type RemoveSectionRequest,
	type RemoveSectionResponse,
	SECTIONS_SERVICE_NAME,
	type SectionsServiceClient,
	type UpdateSectionRequest,
	type UpdateSectionResponse,
} from '@pathly-backend/contracts/learning-paths/v1/sections.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class SectionsService implements OnModuleInit {
	private sectionsServiceClient: SectionsServiceClient

	constructor(@Inject(DiToken.SECTIONS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.sectionsServiceClient = this.client.getService<SectionsServiceClient>(
			SECTIONS_SERVICE_NAME,
		)
	}

	async list(request: ListSectionsRequest): Promise<ListSectionsResponse> {
		const result = await firstValueFrom(
			this.sectionsServiceClient
				.list(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findById(
		request: FindSectionByIdRequest,
	): Promise<FindSectionByIdResponse> {
		const result = await firstValueFrom(
			this.sectionsServiceClient
				.findById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async create(request: CreateSectionRequest): Promise<CreateSectionResponse> {
		const result = await firstValueFrom(
			this.sectionsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(request: UpdateSectionRequest): Promise<UpdateSectionResponse> {
		const result = await firstValueFrom(
			this.sectionsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async reorder(request: ReorderSectionRequest): Promise<ReorderSectionResponse> {
		const result = await firstValueFrom(
			this.sectionsServiceClient
				.reorder(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(request: RemoveSectionRequest): Promise<RemoveSectionResponse> {
		const result = await firstValueFrom(
			this.sectionsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}