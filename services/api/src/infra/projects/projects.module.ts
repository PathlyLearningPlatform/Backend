import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import {
	PostgresProjectProgressRepository,
	PostgresProjectRepository,
	PostgresProjectSubmissionRepository,
} from './repositories';
import { projectHandlersProvider } from './handlers.provider';
import {
	ProjectController,
	ProjectProgressController,
	ProjectSubmissionController,
} from './controllers';

@Module({
	imports: [AuthModule, DbModule],
	controllers: [
		ProjectController,
		ProjectProgressController,
		ProjectSubmissionController,
	],
	providers: [
		PostgresProjectProgressRepository,
		PostgresProjectRepository,
		PostgresProjectSubmissionRepository,
		...projectHandlersProvider,
	],
	exports: [
		PostgresProjectProgressRepository,
		PostgresProjectRepository,
		PostgresProjectSubmissionRepository,
		...projectHandlersProvider,
	],
})
export class ProjectModule {}
