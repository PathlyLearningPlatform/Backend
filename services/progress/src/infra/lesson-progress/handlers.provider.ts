import type { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus, LearningPathsService } from '../common';
import {
	FindLessonProgressByIdHandler,
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
} from '@/app/lesson-progress/queries';
import {
	RemoveLessonProgressHandler,
	StartLessonHandler,
} from '@/app/lesson-progress/commands';
import { PostgresLessonProgressRepository } from './postgres.repository';
import { PostgresLessonProgressReadRepository } from './postgres-read.repository';
import { PostgresUnitProgressReadRepository } from '../unit-progress/postgres-read.repository';

export const lessonProgressHandlersProvider: Provider[] = [
	{
		provide: DiToken.START_LESSON_HANDLER,
		useFactory(
			lessonProgressRepository: PostgresLessonProgressRepository,
			unitProgressReadRepository: PostgresUnitProgressReadRepository,
			learningPathsService: LearningPathsService,
			eventBus: InMemoryEventBus,
		) {
			return new StartLessonHandler(
				lessonProgressRepository,
				unitProgressReadRepository,
				learningPathsService,
				eventBus,
			);
		},
		inject: [
			PostgresLessonProgressRepository,
			PostgresUnitProgressReadRepository,
			LearningPathsService,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_LESSON_PROGRESS_HANDLER,
		useFactory(lessonProgressRepository: PostgresLessonProgressRepository) {
			return new RemoveLessonProgressHandler(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
	{
		provide: DiToken.LIST_LESSON_PROGRESS_HANDLER,
		useFactory(
			lessonProgressReadRepository: PostgresLessonProgressReadRepository,
		) {
			return new ListLessonProgressHandler(lessonProgressReadRepository);
		},
		inject: [PostgresLessonProgressReadRepository],
	},
	{
		provide: DiToken.FIND_LESSON_PROGRESS_BY_ID_HANDLER,
		useFactory(
			lessonProgressReadRepository: PostgresLessonProgressReadRepository,
		) {
			return new FindLessonProgressByIdHandler(lessonProgressReadRepository);
		},
		inject: [PostgresLessonProgressReadRepository],
	},
	{
		provide: DiToken.FIND_LESSON_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			lessonProgressReadRepository: PostgresLessonProgressReadRepository,
		) {
			return new FindLessonProgressForUserHandler(lessonProgressReadRepository);
		},
		inject: [PostgresLessonProgressReadRepository],
	},
];
