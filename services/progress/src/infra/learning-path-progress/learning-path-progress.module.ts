import { Module } from '@nestjs/common';
import { PostgresLearningPathProgressRepository } from './postgres.repository';
import { DbModule } from '@infra/common/db/db.module';
import { PostgresLearningPathProgressReadRepository } from './postgres-read.repository';
import { InMemoryEventBus, LearningPathsModule } from '../common';
import { learningPathProgressHandlersProvider } from './handlers.provider';
import { GrpcLearningPathProgressController } from './grpc.controller';

@Module({
	imports: [DbModule, LearningPathsModule],
	controllers: [GrpcLearningPathProgressController],
	providers: [
		InMemoryEventBus,
		PostgresLearningPathProgressRepository,
		PostgresLearningPathProgressReadRepository,
		...learningPathProgressHandlersProvider,
	],
	exports: [
		PostgresLearningPathProgressRepository,
		PostgresLearningPathProgressReadRepository,
	],
})
export class LearningPathProgressModule {}
