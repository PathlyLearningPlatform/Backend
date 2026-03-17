import { Module } from '@nestjs/common';
import { GrpcLessonProgressController } from './grpc.controller';
import { PostgresLessonProgressRepository } from './postgres.repository';
import { DbModule } from '@infra/common/db/db.module';
import { PostgresLessonProgressReadRepository } from './postgres-read.repository';
import { InMemoryEventBus, LearningPathsModule } from '../common';
import { lessonProgressHandlersProvider } from './handlers.provider';
import { UnitProgressModule } from '../unit-progress/unit-progress.module';

@Module({
	imports: [DbModule, UnitProgressModule, LearningPathsModule],
	controllers: [GrpcLessonProgressController],
	providers: [
		InMemoryEventBus,
		PostgresLessonProgressRepository,
		PostgresLessonProgressReadRepository,
		...lessonProgressHandlersProvider,
	],
	exports: [
		PostgresLessonProgressRepository,
		PostgresLessonProgressReadRepository,
	],
})
export class LessonProgressModule {}
