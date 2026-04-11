import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { learningPathHandlersProvider } from './handlers.provider';
import { LearningPathsController } from './learning-paths.controller';
import { LearningPathProgressController } from './progress/learning-paths.controller';
import { PostgresLearningPathRepository } from './postgres.repository';
import { PostgresLearningPathProgressRepository } from './postgres-progress.repository';
import { PostgresLearningPathProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresLearningPathReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, AuthModule],
	controllers: [LearningPathsController, LearningPathProgressController],
	providers: [
		InMemoryEventBus,
		PostgresLearningPathRepository,
		PostgresLearningPathReadRepository,
		PostgresLearningPathProgressRepository,
		PostgresLearningPathProgressReadRepository,
		...learningPathHandlersProvider,
	],
	exports: [
		PostgresLearningPathRepository,
		PostgresLearningPathReadRepository,
		PostgresLearningPathProgressRepository,
		PostgresLearningPathProgressReadRepository,
		...learningPathHandlersProvider,
	],
})
export class LearningPathsModule {}
