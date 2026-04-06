import { DbModule } from '@infra/common/db/db.module';
import { Module } from '@nestjs/common';
import { UnitsModule } from '../units/units.module';
import { GrpcLessonsController } from './grpc.controller';
import { lessonHandlersProvider } from './handlers.provider';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonProgressRepository } from './postgres-progress.repository';
import { PostgresLessonProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresLessonReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '../common/adapters';

@Module({
	imports: [DbModule, UnitsModule],
	controllers: [GrpcLessonsController],
	providers: [
		InMemoryEventBus,
		PostgresLessonRepository,
		PostgresLessonReadRepository,
		PostgresLessonProgressRepository,
		PostgresLessonProgressReadRepository,
		...lessonHandlersProvider,
	],
	exports: [
		PostgresLessonRepository,
		PostgresLessonReadRepository,
		PostgresLessonProgressRepository,
		PostgresLessonProgressReadRepository,
		...lessonHandlersProvider,
	],
})
export class LessonsModule {}
