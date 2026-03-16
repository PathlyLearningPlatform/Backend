import { Inject, Injectable, Module, OnModuleInit } from '@nestjs/common';
import {
	type ClientGrpc,
	ClientsModule,
	Transport,
} from '@nestjs/microservices';
import { DiToken } from '../enums';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from '../config/config.type';
import { join } from 'path';
import { Options } from '@grpc/proto-loader';
import {
	ACTIVITIES_SERVICE_NAME,
	ActivitiesServiceClient,
	LEARNING_PATHS_V1_PACKAGE_NAME,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import {
	LESSONS_SERVICE_NAME,
	LessonsServiceClient,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import {
	UNITS_SERVICE_NAME,
	UnitsServiceClient,
} from '@pathly-backend/contracts/learning-paths/v1/units.js';
import {
	SECTIONS_SERVICE_NAME,
	SectionsServiceClient,
} from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import {
	LEARNING_PATHS_SERVICE_NAME,
	LearningPathsServiceClient,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import {
	IActivity,
	ILearningPath,
	ILearningPathsService,
	ILesson,
	ISection,
	IUnit,
} from '@/app/common/ports';
import {
	GrpcException,
	throwGrpcException,
} from '@pathly-backend/common/index.js';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class LearningPathsService
	implements OnModuleInit, ILearningPathsService
{
	private activitiesServiceClient: ActivitiesServiceClient;
	private lessonsServiceClient: LessonsServiceClient;
	private unitsServiceClient: UnitsServiceClient;
	private sectionsServiceClient: SectionsServiceClient;
	private learningPathsServiceClient: LearningPathsServiceClient;

	constructor(
		@Inject(DiToken.LEARNING_PATHS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.activitiesServiceClient =
			this.client.getService<ActivitiesServiceClient>(ACTIVITIES_SERVICE_NAME);

		this.lessonsServiceClient =
			this.client.getService<LessonsServiceClient>(LESSONS_SERVICE_NAME);

		this.unitsServiceClient =
			this.client.getService<UnitsServiceClient>(UNITS_SERVICE_NAME);

		this.sectionsServiceClient = this.client.getService<SectionsServiceClient>(
			SECTIONS_SERVICE_NAME,
		);

		this.learningPathsServiceClient =
			this.client.getService<LearningPathsServiceClient>(
				LEARNING_PATHS_SERVICE_NAME,
			);
	}

	async findActivityById(id: string): Promise<IActivity | null> {
		try {
			const res = await firstValueFrom(
				this.activitiesServiceClient
					.findById({ where: { id } })
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
				default:
					throw err;
			}
		}
	}

	async findLessonById(id: string): Promise<ILesson | null> {
		try {
			const res = await firstValueFrom(
				this.lessonsServiceClient
					.findById({ where: { id } })
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
				default:
					throw err;
			}
		}
	}

	async findUnitById(id: string): Promise<IUnit | null> {
		try {
			const res = await firstValueFrom(
				this.unitsServiceClient
					.findById({ where: { id } })
					.pipe(catchError(throwGrpcException)),
			);

			return {
				id: res.unit!.id,
				sectionId: res.unit!.sectionId,
				lessonCount: res.unit!.lessonCount,
			};
		} catch (err) {
			const grpcErr = err as GrpcException;
			const errRes = grpcErr.getGrpcError();

			switch (errRes.apiCode) {
				default:
					throw err;
			}
		}
	}

	async findSectionById(id: string): Promise<ISection | null> {
		try {
			const res = await firstValueFrom(
				this.sectionsServiceClient
					.findById({ where: { id } })
					.pipe(catchError(throwGrpcException)),
			);

			return {
				id: res.section!.id,
				learningPathId: res.section!.learningPathId,
				unitCount: res.section!.unitCount,
			};
		} catch (err) {
			const grpcErr = err as GrpcException;
			const errRes = grpcErr.getGrpcError();

			switch (errRes.apiCode) {
				default:
					throw err;
			}
		}
	}

	async findLearningPathById(id: string): Promise<ILearningPath | null> {
		try {
			const res = await firstValueFrom(
				this.learningPathsServiceClient
					.findById({ where: { id } })
					.pipe(catchError(throwGrpcException)),
			);

			return {
				id: res.learningPath!.id,
				sectionCount: res.learningPath!.sectionCount,
			};
		} catch (err) {
			const grpcErr = err as GrpcException;
			const errRes = grpcErr.getGrpcError();

			switch (errRes.apiCode) {
				default:
					throw err;
			}
		}
	}
}

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.LEARNING_PATHS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<Config['app']>('app')!;

					return {
						transport: Transport.GRPC,
						options: {
							package: LEARNING_PATHS_V1_PACKAGE_NAME,
							protoPath: [
								join(appConfig.protoDir, 'learning-paths/v1/activities.proto'),
								join(appConfig.protoDir, 'learning-paths/v1/lessons.proto'),
								join(appConfig.protoDir, 'learning-paths/v1/units.proto'),
								join(appConfig.protoDir, 'learning-paths/v1/sections.proto'),
								join(
									appConfig.protoDir,
									'learning-paths/v1/learning-paths.proto',
								),
							],
							url: appConfig.learningPathsServiceUrl,
							loader: {
								includeDirs: [
									join(appConfig.protoDir),
									join(appConfig.protoDir, 'learning-paths/v1'),
								],
								arrays: true,
								defaults: true,
							} as Options,
						},
					};
				},
				inject: [ConfigService],
			},
		]),
	],
	providers: [LearningPathsService],
	exports: [LearningPathsService],
})
export class LearningPathsModule {}
