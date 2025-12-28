import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { GrpcLearningPathsController } from './grpc.controller';
import { PostgresLearningPathsRepository } from './postgres.repository';
import { learningPathsUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule],
	controllers: [GrpcLearningPathsController],
	providers: [PostgresLearningPathsRepository, ...learningPathsUseCasesProvider],
	exports: [PostgresLearningPathsRepository, ...learningPathsUseCasesProvider],
})
export class LearningPathsModule {}
