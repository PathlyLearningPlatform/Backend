import type { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus } from './common';
import { OnActivityCompletedHandler } from '@/app/activity-progress/events';
import { OnLessonCompletedHandler } from '@/app/lesson-progress/events';
import { OnUnitCompletedHandler } from '@/app/unit-progress/events';
import { OnSectionCompletedHandler } from '@/app/section-progress/events';
import { OnLearningPathCompletedHandler } from '@/app/learning-path-progress/events';
import { PostgresLessonProgressRepository } from './lesson-progress/postgres.repository';
import { PostgresLessonProgressReadRepository } from './lesson-progress/postgres-read.repository';
import { PostgresUnitProgressRepository } from './unit-progress/postgres.repository';
import { PostgresUnitProgressReadRepository } from './unit-progress/postgres-read.repository';
import { PostgresSectionProgressRepository } from './section-progress/postgres.repository';
import { PostgresSectionProgressReadRepository } from './section-progress/postgres-read.repository';
import { PostgresLearningPathProgressRepository } from './learning-path-progress/postgres.repository';
import { PostgresLearningPathProgressReadRepository } from './learning-path-progress/postgres-read.repository';

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
