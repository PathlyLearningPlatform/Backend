import { Module } from '@nestjs/common';
import { GrpcActivityProgressController } from './grpc.controller';
import { PostgresActivityProgressRepository } from './postgres.repository';
import { DbModule } from '@infra/common/db/db.module';
import { PostgresActivityProgressReadRepository } from './postgres-read.repository';
import { activityProgressHandlersProvider } from './handlers.provider';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { InMemoryEventBus, LearningPathsModule } from '../common';

@Module({
	imports: [DbModule, LessonProgressModule, LearningPathsModule],
	controllers: [GrpcActivityProgressController],
	providers: [
		InMemoryEventBus,
		PostgresActivityProgressRepository,
		PostgresActivityProgressReadRepository,
		...activityProgressHandlersProvider,
	],
	exports: [
		PostgresActivityProgressRepository,
		PostgresActivityProgressReadRepository,
	],
})
export class ActivityProgressModule {}
