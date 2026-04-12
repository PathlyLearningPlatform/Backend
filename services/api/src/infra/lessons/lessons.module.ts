import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UnitsModule } from '../units/units.module';
import { lessonHandlersProvider } from './handlers.provider';
import { LessonsController } from './lessons.controller';
import { LessonProgressController } from './progress.controller';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonProgressRepository } from './postgres-progress.repository';
import { PostgresLessonProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresLessonReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, UnitsModule, AuthModule],
	controllers: [LessonsController, LessonProgressController],
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
