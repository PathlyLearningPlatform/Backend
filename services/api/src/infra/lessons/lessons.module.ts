import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UnitsModule } from '../units/units.module';
import { lessonHandlersProvider } from './handlers.provider';
import { LessonsController } from './lessons.controller';
import { LessonProgressController } from './progress.controller';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonProgressRepository } from './postgres-progress.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, UnitsModule, AuthModule],
	controllers: [LessonsController, LessonProgressController],
	providers: [
		InMemoryEventBus,
		PostgresLessonRepository,
		PostgresLessonProgressRepository,
		...lessonHandlersProvider,
	],
	exports: [
		PostgresLessonRepository,
		PostgresLessonProgressRepository,
		...lessonHandlersProvider,
	],
})
export class LessonsModule {}
