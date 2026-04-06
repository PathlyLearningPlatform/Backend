import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import {
	RemoveLessonHandler,
	RemoveLessonProgressHandler,
	StartLessonHandler,
	UpdateLessonHandler,
} from '@/app/lessons/commands';
import type {
	ILessonProgressReadRepository,
	ILessonReadRepository,
} from '@/app/lessons/interfaces';
import {
	FindLessonByIdHandler,
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
	ListLessonsHandler,
} from '@/app/lessons/queries';
import { AddLessonHandler, ReorderLessonHandler } from '@/app/units/commands';
import type { ILessonProgressRepository } from '@/domain/lessons';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import type { IUnitRepository } from '@/domain/units/repositories';
import { InMemoryEventBus } from '../common/adapters';
import { DiToken } from '../common/enums';
import { PostgresUnitRepository } from '../units/postgres.repository';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonProgressRepository } from './postgres-progress.repository';
import { PostgresLessonProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresLessonReadRepository } from './postgres-read.repository';

export const lessonHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_LESSONS_HANDLER,
		useFactory(lessonReadRepository: ILessonReadRepository) {
			return new ListLessonsHandler(lessonReadRepository);
		},
		inject: [PostgresLessonReadRepository],
	},
	{
		provide: DiToken.FIND_LESSON_BY_ID_HANDLER,
		useFactory(lessonReadRepository: ILessonReadRepository) {
			return new FindLessonByIdHandler(lessonReadRepository);
		},
		inject: [PostgresLessonReadRepository],
	},
	{
		provide: DiToken.ADD_LESSON_HANDLER,
		useFactory(
			unitRepository: IUnitRepository,
			lessonRepository: ILessonRepository,
		) {
			return new AddLessonHandler(unitRepository, lessonRepository);
		},
		inject: [PostgresUnitRepository, PostgresLessonRepository],
	},
	{
		provide: DiToken.REORDER_LESSON_HANDLER,
		useFactory(
			unitRepository: IUnitRepository,
			lessonRepository: ILessonRepository,
		) {
			return new ReorderLessonHandler(unitRepository, lessonRepository);
		},
		inject: [PostgresUnitRepository, PostgresLessonRepository],
	},
	{
		provide: DiToken.UPDATE_LESSON_HANDLER,
		useFactory(lessonRepository: ILessonRepository) {
			return new UpdateLessonHandler(lessonRepository);
		},
		inject: [PostgresLessonRepository],
	},
	{
		provide: DiToken.REMOVE_LESSON_HANDLER,
		useFactory(
			unitRepository: IUnitRepository,
			lessonRepository: ILessonRepository,
		) {
			return new RemoveLessonHandler(unitRepository, lessonRepository);
		},
		inject: [PostgresUnitRepository, PostgresLessonRepository],
	},
	{
		provide: DiToken.START_LESSON_HANDLER,
		useFactory(
			lessonProgressRepository: ILessonProgressRepository,
			lessonReadRepository: ILessonReadRepository,
			eventBus: IEventBus,
		) {
			return new StartLessonHandler(
				lessonProgressRepository,
				lessonReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLessonProgressRepository,
			PostgresLessonReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_LESSON_PROGRESS_HANDLER,
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new RemoveLessonProgressHandler(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
	{
		provide: DiToken.LIST_LESSON_PROGRESS_HANDLER,
		useFactory(lessonProgressReadRepository: ILessonProgressReadRepository) {
			return new ListLessonProgressHandler(lessonProgressReadRepository);
		},
		inject: [PostgresLessonProgressReadRepository],
	},
	{
		provide: DiToken.FIND_LESSON_PROGRESS_FOR_USER_HANDLER,
		useFactory(lessonProgressReadRepository: ILessonProgressReadRepository) {
			return new FindLessonProgressForUserHandler(lessonProgressReadRepository);
		},
		inject: [PostgresLessonProgressReadRepository],
	},
];
