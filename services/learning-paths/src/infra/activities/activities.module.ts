import { Module } from '@nestjs/common';
import { DbModule } from '@infra/common/db/db.module';
import { LessonsModule } from '../lessons/lessons.module';
import { GrpcActivitiesController } from './grpc.controller';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityReadRepository } from './postgres-read.repository';
import { activityHandlersProvider } from './handlers.provider';

@Module({
	imports: [DbModule, LessonsModule],
	controllers: [GrpcActivitiesController],
	providers: [
		PostgresActivityRepository,
		PostgresActivityReadRepository,
		...activityHandlersProvider,
	],
	exports: [
		PostgresActivityRepository,
		PostgresActivityReadRepository,
		...activityHandlersProvider,
	],
})
export class ActivitiesModule {}
