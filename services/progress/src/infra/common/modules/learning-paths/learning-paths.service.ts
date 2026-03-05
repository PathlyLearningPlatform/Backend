import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { DiToken } from '../../enums';
import {
	IActivity,
	ILearningPathsService,
	ILesson,
} from '@/app/common/interfaces';
import {
	ACTIVITIES_SERVICE_NAME,
	ActivitiesServiceClient,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import { catchError, firstValueFrom } from 'rxjs';
import {
	GrpcException,
	throwGrpcException,
} from '@pathly-backend/common/index.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	LESSONS_SERVICE_NAME,
	LessonsServiceClient,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js';

@Injectable()
export class LearningPathsService
	implements OnModuleInit, ILearningPathsService
{
	private activitiesServiceClient: ActivitiesServiceClient;
	private lessonsServiceClient: LessonsServiceClient;

	constructor(
		@Inject(DiToken.LEARNING_PATHS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.activitiesServiceClient =
			this.client.getService<ActivitiesServiceClient>(ACTIVITIES_SERVICE_NAME);
		this.lessonsServiceClient =
			this.client.getService<LessonsServiceClient>(LESSONS_SERVICE_NAME);
	}

	async activityExistsById(id: string): Promise<boolean> {
		try {
			await firstValueFrom(
				this.activitiesServiceClient
					.findOne({ where: { id } })
					.pipe(catchError(throwGrpcException)),
			);
		} catch (err) {
			const grpcErr = err as GrpcException;
			const errRes = grpcErr.getGrpcError();

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					return false;
				default:
					throw err;
			}
		}

		return true;
	}

	async findActivityById(id: string): Promise<IActivity | null> {
		try {
			const res = await firstValueFrom(
				this.activitiesServiceClient
					.findOne({ where: { id } })
					.pipe(catchError(throwGrpcException)),
			);

			return {
				id: res.activity!.id,
				lessonId: res.activity!.lessonId,
			};
		} catch (err) {
			const grpcErr = err as GrpcException;
			const errRes = grpcErr.getGrpcError();

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					return null;
				default:
					throw err;
			}
		}
	}

	async findLessonById(id: string): Promise<ILesson | null> {
		try {
			const res = await firstValueFrom(
				this.lessonsServiceClient
					.findOne({ where: { id } })
					.pipe(catchError(throwGrpcException)),
			);

			return {
				id: res.lesson!.id,
				unitId: res.lesson!.unitId,
				activityCount: res.lesson!.activityCount,
			};
		} catch (err) {
			const grpcErr = err as GrpcException;
			const errRes = grpcErr.getGrpcError();

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_NOT_FOUND:
					return null;
				default:
					throw err;
			}
		}
	}
}
