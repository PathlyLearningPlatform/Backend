import { DbModule } from '@infra/common/db/db.module';
import { Module } from '@nestjs/common';
import { GrpcLearningPathsController } from './grpc.controller';
import { learningPathHandlersProvider } from './handlers.provider';
import { PostgresLearningPathRepository } from './postgres.repository';
import { PostgresLearningPathProgressRepository } from './postgres-progress.repository';
import { PostgresLearningPathProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresLearningPathReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '../common/adapters';

@Module({
	imports: [DbModule],
	controllers: [GrpcLearningPathsController],
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
