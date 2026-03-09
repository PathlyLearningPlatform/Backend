import { Module } from '@nestjs/common';
import { DbModule } from '@infra/common/db/db.module';
import { GrpcLearningPathsController } from './grpc.controller';
import { PostgresLearningPathRepository } from './postgres.repository';
import { learningPathHandlersProvider } from './handlers.provider';
import { PostgresLearningPathReadRepository } from './postgres-read.repository';

@Module({
	imports: [DbModule],
	controllers: [GrpcLearningPathsController],
	providers: [
		PostgresLearningPathRepository,
		PostgresLearningPathReadRepository,
		...learningPathHandlersProvider,
	],
	exports: [
		PostgresLearningPathRepository,
		PostgresLearningPathReadRepository,
		...learningPathHandlersProvider,
	],
})
export class LearningPathsModule {}
