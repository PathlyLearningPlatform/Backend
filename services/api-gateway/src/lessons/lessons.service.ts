import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	type CreateLessonRequest,
	type CreateLessonResponse,
	type FindLessonByIdRequest,
	type FindLessonByIdResponse,
	type ListLessonsRequest,
	type ListLessonsResponse,
	type ReorderLessonRequest,
	type ReorderLessonResponse,
	LESSONS_SERVICE_NAME,
	type LessonsServiceClient,
	type RemoveLessonRequest,
	type RemoveLessonResponse,
	type UpdateLessonRequest,
	type UpdateLessonResponse,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js'
import { catchError, firstValueFrom } from 'rxjs'
import { DiToken } from '../common/enums'

@Injectable()
export class LessonsService implements OnModuleInit {
	private lessonsServiceClient: LessonsServiceClient

	constructor(@Inject(DiToken.LESSONS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.lessonsServiceClient =
			this.client.getService<LessonsServiceClient>(LESSONS_SERVICE_NAME)
	}

	async list(request: ListLessonsRequest): Promise<ListLessonsResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.list(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findById(
		request: FindLessonByIdRequest,
	): Promise<FindLessonByIdResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.findById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async create(request: CreateLessonRequest): Promise<CreateLessonResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(request: UpdateLessonRequest): Promise<UpdateLessonResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async reorder(request: ReorderLessonRequest): Promise<ReorderLessonResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.reorder(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(request: RemoveLessonRequest): Promise<RemoveLessonResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}
