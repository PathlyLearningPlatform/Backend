import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { activityHandlersProvider } from './handlers.provider';
import { ActivitiesController } from './activities.controller';
import { ActivityProgressController } from './progress.controller';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityProgressRepository } from './postgres-progress.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, LessonsModule, AuthModule],
	controllers: [ActivitiesController, ActivityProgressController],
	providers: [
		InMemoryEventBus,
		PostgresActivityRepository,
		PostgresActivityProgressRepository,
		...activityHandlersProvider,
	],
	exports: [
		PostgresActivityRepository,
		PostgresActivityProgressRepository,
		...activityHandlersProvider,
	],
})
export class ActivitiesModule {}
