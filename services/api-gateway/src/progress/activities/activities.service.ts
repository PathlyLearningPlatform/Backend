import { DiToken } from '@/common/enums'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { type ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	ACTIVITY_PROGRESS_SERVICE_NAME,
	ActivityProgressServiceClient,
	CompleteActivityRequest,
	CompleteActivityResponse,
	FindActivityProgressByIdRequest,
	FindActivityProgressByIdResponse,
	FindActivityProgressForUserRequest,
	FindActivityProgressForUserResponse,
	ListActivityProgressRequest,
	ListActivityProgressResponse,
	RemoveActivityProgressRequest,
	RemoveActivityProgressResponse,
} from '@pathly-backend/contracts/progress/v1/activities.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class ActivityProgressService implements OnModuleInit {
	private activityProgressServiceClient: ActivityProgressServiceClient

	constructor(
		@Inject(DiToken.ACTIVITY_PROGRESS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.activityProgressServiceClient =
			this.client.getService<ActivityProgressServiceClient>(
				ACTIVITY_PROGRESS_SERVICE_NAME,
			)
	}

	async list(
		request: ListActivityProgressRequest,
	): Promise<ListActivityProgressResponse> {
		const result = await firstValueFrom(
			this.activityProgressServiceClient
				.list(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findById(
		request: FindActivityProgressByIdRequest,
	): Promise<FindActivityProgressByIdResponse> {
		const result = await firstValueFrom(
			this.activityProgressServiceClient
				.findById(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
	async findForUser(
		request: FindActivityProgressForUserRequest,
	): Promise<FindActivityProgressForUserResponse> {
		const result = await firstValueFrom(
			this.activityProgressServiceClient
				.findForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async complete(
		request: CompleteActivityRequest,
	): Promise<CompleteActivityResponse> {
		const result = await firstValueFrom(
			this.activityProgressServiceClient
				.complete(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async remove(
		request: RemoveActivityProgressRequest,
	): Promise<RemoveActivityProgressResponse> {
		const result = await firstValueFrom(
			this.activityProgressServiceClient
				.remove(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
}
