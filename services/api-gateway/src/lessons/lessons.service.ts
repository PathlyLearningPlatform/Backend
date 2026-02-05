import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/nestjs/helpers/throw-grpc-exception.helper.js'
import {
	type CreateLessonRequest,
	type CreateLessonResponse,
	type FindLessonsRequest,
	type FindLessonsResponse,
	type FindOneLessonRequest,
	type FindOneLessonResponse,
	LESSONS_SERVICE_NAME,
	type LessonsServiceClient,
	type RemoveLessonRequest,
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

	async find(request: FindLessonsRequest): Promise<FindLessonsResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.find(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findOne(request: FindOneLessonRequest): Promise<FindOneLessonResponse> {
		const result = await firstValueFrom(
			this.lessonsServiceClient
				.findOne(request)
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

	async remove(request: RemoveLessonRequest): Promise<void> {
		await firstValueFrom(
			this.lessonsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)
	}
}
