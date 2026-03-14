import { DiToken } from '@/common/enums'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	LESSON_PROGRESS_SERVICE_NAME,
	type FindLessonProgressByIdRequest,
	type FindLessonProgressByIdResponse,
	type FindOneLessonProgressForUserRequest,
	type FindOneLessonProgressForUserResponse,
	type LessonProgressServiceClient,
	type ListLessonProgressRequest,
	type ListLessonProgressResponse,
	type RemoveLessonProgressByIdRequest,
	type RemoveLessonProgressByIdResponse,
	type StartLessonRequest,
	type StartLessonResponse,
} from '@pathly-backend/contracts/progress/v1/lessons.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class LessonProgressService implements OnModuleInit {
	private lessonProgressServiceClient!: LessonProgressServiceClient

	constructor(
		@Inject(DiToken.LESSON_PROGRESS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.lessonProgressServiceClient =
			this.client.getService<LessonProgressServiceClient>(
				LESSON_PROGRESS_SERVICE_NAME,
			)
	}

	async list(
		request: ListLessonProgressRequest,
	): Promise<ListLessonProgressResponse> {
		const result = await firstValueFrom(
			this.lessonProgressServiceClient
				.list(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findById(
		request: FindLessonProgressByIdRequest,
	): Promise<FindLessonProgressByIdResponse> {
		const result = await firstValueFrom(
			this.lessonProgressServiceClient
				.findById(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findOneForUser(
		request: FindOneLessonProgressForUserRequest,
	): Promise<FindOneLessonProgressForUserResponse> {
		const result = await firstValueFrom(
			this.lessonProgressServiceClient
				.findOneForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async start(request: StartLessonRequest): Promise<StartLessonResponse> {
		const result = await firstValueFrom(
			this.lessonProgressServiceClient
				.start(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async removeById(
		request: RemoveLessonProgressByIdRequest,
	): Promise<RemoveLessonProgressByIdResponse> {
		const result = await firstValueFrom(
			this.lessonProgressServiceClient
				.removeById(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
}
