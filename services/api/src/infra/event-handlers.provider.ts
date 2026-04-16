import type { Provider } from '@nestjs/common';
import { OnActivityCompletedHandler } from '@/app/activities/events';
import { OnLearningPathCompletedHandler } from '@/app/learning-paths/events';
import { OnLessonCompletedHandler } from '@/app/lessons/events';
import { OnSectionCompletedHandler } from '@/app/sections/events';
import { OnUnitCompletedHandler } from '@/app/units/events';
import { PostgresLearningPathProgressRepository } from '@/infra/learning-paths/postgres-progress.repository';
import { PostgresLessonProgressRepository } from '@/infra/lessons/postgres-progress.repository';
import { PostgresSectionProgressRepository } from '@/infra/sections/postgres-progress.repository';
import { PostgresUnitProgressRepository } from '@/infra/units/postgres-progress.repository';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';

export const eventHandlersProvider: Provider[] = [
	{
		provide: DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		useFactory(
			lessonProgressRepository: PostgresLessonProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnActivityCompletedHandler(lessonProgressRepository, eventBus);
		},
		inject: [PostgresLessonProgressRepository, InMemoryEventBus],
	},
	{
		provide: DiToken.ON_LESSON_COMPLETED_HANDLER,
		useFactory(
			unitProgressRepository: PostgresUnitProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnLessonCompletedHandler(unitProgressRepository, eventBus);
		},
		inject: [PostgresUnitProgressRepository, InMemoryEventBus],
	},
	{
		provide: DiToken.ON_UNIT_COMPLETED_HANDLER,
		useFactory(
			sectionProgressRepository: PostgresSectionProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnUnitCompletedHandler(sectionProgressRepository, eventBus);
		},
		inject: [PostgresSectionProgressRepository, InMemoryEventBus],
	},
	{
		provide: DiToken.ON_SECTION_COMPLETED_HANDLER,
		useFactory(
			learningPathProgressRepository: PostgresLearningPathProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnSectionCompletedHandler(
				learningPathProgressRepository,
				eventBus,
			);
		},
		inject: [PostgresLearningPathProgressRepository, InMemoryEventBus],
	},
	{
		provide: DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER,
		useFactory() {
			return new OnLearningPathCompletedHandler();
		},
	},
];
