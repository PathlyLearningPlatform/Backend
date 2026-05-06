import { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus } from './common';
import {
	OnLearningPathCompletedHandler,
	OnLearningPathStartedHandler,
} from '@/app/learning-paths/events';
import {
	OnSectionCompletedHandler,
	OnSectionStartedHandler,
} from '@/app/sections/events';
import {
	OnUnitCompletedHandler,
	OnUnitStartedHandler,
} from '@/app/units/events';
import { PostgresSectionRepository } from './sections/postgres.repository';
import { PostgresSectionProgressRepository } from './sections/postgres-progress.repository';
import { PostgresUnitRepository } from './units/postgres.repository';
import { PostgresUnitProgressRepository } from './units/postgres-progress.repository';
import { PostgresLessonRepository } from './lessons/postgres.repository';
import { PostgresLessonProgressRepository } from './lessons/postgres-progress.repository';
import {
	ISectionRepository,
	ISectionProgressRepository,
} from '@/domain/sections';
import { IUnitRepository, IUnitProgressRepository } from '@/domain/units';
import { ILessonRepository, ILessonProgressRepository } from '@/domain/lessons';
import { IEventBus } from '@/app/common';
import { OnLessonCompletedHandler } from '@/app/lessons/events';
import { OnActivityCompletedHandler } from '@/app/activities/events';
import { PostgresLearningPathProgressRepository } from './learning-paths/postgres-progress.repository';
import { ILearningPathProgressRepository } from '@/domain/learning-paths';

export const eventHandlerProviders: Provider[] = [
	{
		provide: DiToken.ON_LEARNING_PATH_STARTED_HANDLER,
		useFactory(
			sectionRepository: ISectionRepository,
			sectionProgressRepository: ISectionProgressRepository,
			eventBus: IEventBus,
		) {
			return new OnLearningPathStartedHandler(
				sectionProgressRepository,
				sectionRepository,
				eventBus,
			);
		},
		inject: [
			PostgresSectionRepository,
			PostgresSectionProgressRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER,
		useFactory() {
			return new OnLearningPathCompletedHandler();
		},
		inject: [],
	},

	{
		provide: DiToken.ON_SECTION_STARTED_HANDLER,
		useFactory(
			unitRepository: IUnitRepository,
			unitProgressRepository: IUnitProgressRepository,
			eventBus: IEventBus,
		) {
			return new OnSectionStartedHandler(
				unitProgressRepository,
				unitRepository,
				eventBus,
			);
		},
		inject: [
			PostgresUnitRepository,
			PostgresUnitProgressRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_SECTION_COMPLETED_HANDLER,
		useFactory(
			learningPathProgressRepository: ILearningPathProgressRepository,
			eventBus: IEventBus,
			sectionProgressRepository: ISectionProgressRepository,
			sectionRepository: ISectionRepository,
		) {
			return new OnSectionCompletedHandler(
				learningPathProgressRepository,
				sectionProgressRepository,
				sectionRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLearningPathProgressRepository,
			InMemoryEventBus,
			PostgresSectionProgressRepository,
			PostgresSectionRepository,
		],
	},

	{
		provide: DiToken.ON_UNIT_STARTED_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			lessonProgressRepository: ILessonProgressRepository,
			eventBus: IEventBus,
		) {
			return new OnUnitStartedHandler(
				lessonProgressRepository,
				lessonRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLessonRepository,
			PostgresLessonProgressRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.ON_UNIT_COMPLETED_HANDLER,
		useFactory(
			sectionProgressRepository: ISectionProgressRepository,
			eventBus: IEventBus,
			unitProgressRepository: IUnitProgressRepository,
			unitRepository: IUnitRepository,
		) {
			return new OnUnitCompletedHandler(
				sectionProgressRepository,
				unitProgressRepository,
				unitRepository,
				eventBus,
			);
		},
		inject: [
			PostgresSectionProgressRepository,
			InMemoryEventBus,
			PostgresUnitProgressRepository,
			PostgresUnitRepository,
		],
	},

	{
		provide: DiToken.ON_LESSON_STARTED_HANDLER,
		useFactory() {},
		inject: [],
	},
	{
		provide: DiToken.ON_LESSON_COMPLETED_HANDLER,
		useFactory(
			unitProgressRepository: IUnitProgressRepository,
			eventBus: IEventBus,
			lessonProgressRepository: ILessonProgressRepository,
			lessonRepository: ILessonRepository,
		) {
			return new OnLessonCompletedHandler(
				unitProgressRepository,
				lessonProgressRepository,
				lessonRepository,
				eventBus,
			);
		},
		inject: [
			PostgresUnitProgressRepository,
			InMemoryEventBus,
			PostgresLessonProgressRepository,
			PostgresLessonRepository,
		],
	},

	{
		provide: DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		useFactory(
			lessonProgressRepository: ILessonProgressRepository,
			eventBus: IEventBus,
		) {
			return new OnActivityCompletedHandler(lessonProgressRepository, eventBus);
		},
		inject: [PostgresLessonProgressRepository, InMemoryEventBus],
	},
];
