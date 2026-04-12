import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { activityHandlersProvider } from './handlers.provider';
import { ActivitiesController } from './activities.controller';
import { ArticlesController } from './articles.controller';
import { ExercisesController } from './exercises.controller';
import { QuizzesController } from './quizzes.controller';
import { ActivityProgressController } from './progress.controller';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityProgressRepository } from './postgres-progress.repository';
import { PostgresActivityProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresActivityReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, LessonsModule, AuthModule],
	controllers: [
		ActivitiesController,
		ArticlesController,
		ExercisesController,
		QuizzesController,
		ActivityProgressController,
	],
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
