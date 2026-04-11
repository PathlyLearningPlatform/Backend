import type { Provider } from '@nestjs/common';
import { OnActivityCompletedHandler } from '@/app/activities/events';
import { OnLearningPathCompletedHandler } from '@/app/learning-paths/events';
import { OnLessonCompletedHandler } from '@/app/lessons/events';
import { OnSectionCompletedHandler } from '@/app/sections/events';
import { OnUnitCompletedHandler } from '@/app/units/events';
import { PostgresLearningPathProgressRepository } from '@/infra/learning-paths/postgres-progress.repository';
import { PostgresLearningPathProgressReadRepository } from '@/infra/learning-paths/postgres-progress-read.repository';
import { PostgresLessonProgressRepository } from '@/infra/lessons/postgres-progress.repository';
import { PostgresLessonProgressReadRepository } from '@/infra/lessons/postgres-progress-read.repository';
import { PostgresSectionProgressRepository } from '@/infra/sections/postgres-progress.repository';
import { PostgresSectionProgressReadRepository } from '@/infra/sections/postgres-progress-read.repository';
import { PostgresUnitProgressRepository } from '@/infra/units/postgres-progress.repository';
import { PostgresUnitProgressReadRepository } from '@/infra/units/postgres-progress-read.repository';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';

export const eventHandlersProvider: Provider[] = [
	{
		provide: DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		useFactory(
			lessonProgressRepository: PostgresLessonProgressRepository,
			lessonProgressReadRepository: PostgresLessonProgressReadRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnActivityCompletedHandler(
				lessonProgressRepository,
				lessonProgressReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLessonProgressRepository,
			PostgresLessonProgressReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_LESSON_COMPLETED_HANDLER,
		useFactory(
			unitProgressRepository: PostgresUnitProgressRepository,
			unitProgressReadRepository: PostgresUnitProgressReadRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnLessonCompletedHandler(
				unitProgressRepository,
				unitProgressReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresUnitProgressRepository,
			PostgresUnitProgressReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_UNIT_COMPLETED_HANDLER,
		useFactory(
			sectionProgressRepository: PostgresSectionProgressRepository,
			sectionProgressReadRepository: PostgresSectionProgressReadRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnUnitCompletedHandler(
				sectionProgressRepository,
				sectionProgressReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresSectionProgressRepository,
			PostgresSectionProgressReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_SECTION_COMPLETED_HANDLER,
		useFactory(
			learningPathProgressRepository: PostgresLearningPathProgressRepository,
			learningPathProgressReadRepository: PostgresLearningPathProgressReadRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnSectionCompletedHandler(
				learningPathProgressRepository,
				learningPathProgressReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLearningPathProgressRepository,
			PostgresLearningPathProgressReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER,
		useFactory() {
			return new OnLearningPathCompletedHandler();
		},
	},
];
