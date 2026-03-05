import { Module } from '@nestjs/common';
import { GrpcActivityProgressController } from './grpc.controller';
import { PostgresActivityProgressRepository } from './postgres.repository';
import { DbModule } from '../db/db.module';
import { LearningPathsModule } from '../learning-paths/learning-paths.module';
import { activityProgressUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule, LearningPathsModule],
	controllers: [GrpcActivityProgressController],
	providers: [
		PostgresActivityProgressRepository,
		...activityProgressUseCasesProvider,
	],
	exports: [
		PostgresActivityProgressRepository,
		...activityProgressUseCasesProvider,
	],
})
export class ActivityProgressModule {}
