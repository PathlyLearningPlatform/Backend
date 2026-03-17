import { DiToken } from '@/common/enums'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	SECTION_PROGRESS_SERVICE_NAME,
	type FindSectionProgressByIdRequest,
	type FindSectionProgressByIdResponse,
	type FindSectionProgressForUserRequest,
	type FindSectionProgressForUserResponse,
	type ListSectionProgressRequest,
	type ListSectionProgressResponse,
	type RemoveSectionProgressRequest,
	type RemoveSectionProgressResponse,
	type SectionProgressServiceClient,
	type StartSectionRequest,
	type StartSectionResponse,
} from '@pathly-backend/contracts/progress/v1/sections.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class SectionProgressService implements OnModuleInit {
	private sectionProgressServiceClient!: SectionProgressServiceClient

	constructor(
		@Inject(DiToken.SECTION_PROGRESS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.sectionProgressServiceClient =
			this.client.getService<SectionProgressServiceClient>(
				SECTION_PROGRESS_SERVICE_NAME,
			)
	}

	async list(
		request: ListSectionProgressRequest,
	): Promise<ListSectionProgressResponse> {
		const result = await firstValueFrom(
			this.sectionProgressServiceClient
				.list(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findById(
		request: FindSectionProgressByIdRequest,
	): Promise<FindSectionProgressByIdResponse> {
		const result = await firstValueFrom(
			this.sectionProgressServiceClient
				.findById(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findForUser(
		request: FindSectionProgressForUserRequest,
	): Promise<FindSectionProgressForUserResponse> {
		const result = await firstValueFrom(
			this.sectionProgressServiceClient
				.findForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async start(request: StartSectionRequest): Promise<StartSectionResponse> {
		const result = await firstValueFrom(
			this.sectionProgressServiceClient
				.start(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async remove(
		request: RemoveSectionProgressRequest,
	): Promise<RemoveSectionProgressResponse> {
		const result = await firstValueFrom(
			this.sectionProgressServiceClient
				.remove(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
}
