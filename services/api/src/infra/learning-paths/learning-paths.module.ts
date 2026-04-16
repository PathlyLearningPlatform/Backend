import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { learningPathHandlersProvider } from './handlers.provider';
import { LearningPathsController } from './learning-paths.controller';
import { LearningPathProgressController } from './progress.controller';
import { PostgresLearningPathRepository } from './postgres.repository';
import { PostgresLearningPathProgressRepository } from './postgres-progress.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, AuthModule],
	controllers: [LearningPathsController, LearningPathProgressController],
	providers: [
		InMemoryEventBus,
		PostgresLearningPathRepository,
		PostgresLearningPathProgressRepository,
		...learningPathHandlersProvider,
	],
	exports: [
		PostgresLearningPathRepository,
		PostgresLearningPathProgressRepository,
		...learningPathHandlersProvider,
	],
})
export class LearningPathsModule {}
