import { DbModule } from '@infra/common/db/db.module';
import { Module } from '@nestjs/common';
import { LessonsModule } from '../lessons/lessons.module';
import { GrpcActivitiesController } from './grpc.controller';
import { activityHandlersProvider } from './handlers.provider';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityProgressRepository } from './postgres-progress.repository';
import { PostgresActivityProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresActivityReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '../common/adapters';

@Module({
	imports: [DbModule, LessonsModule],
	controllers: [GrpcActivitiesController],
	providers: [
		InMemoryEventBus,
		PostgresActivityRepository,
		PostgresActivityReadRepository,
		PostgresActivityProgressRepository,
		PostgresActivityProgressReadRepository,
		...activityHandlersProvider,
	],
	exports: [
		PostgresActivityRepository,
		PostgresActivityReadRepository,
		PostgresActivityProgressRepository,
		PostgresActivityProgressReadRepository,
		...activityHandlersProvider,
	],
})
export class ActivitiesModule {}
