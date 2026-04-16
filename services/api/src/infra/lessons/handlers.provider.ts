import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import {
	RemoveLessonHandler,
	RemoveLessonProgressHandler,
	StartLessonHandler,
	UpdateLessonHandler,
} from '@/app/lessons/commands';
import {
	FindLessonByIdHandler,
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
	ListLessonsHandler,
} from '@/app/lessons/queries';
import { AddLessonHandler, ReorderLessonHandler } from '@/app/units/commands';
import type {
	ILessonProgressRepository,
	ILessonRepository,
} from '@/domain/lessons';
import type { IUnitRepository } from '@/domain/units/repositories';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';
import { PostgresUnitRepository } from '../units/postgres.repository';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonProgressRepository } from './postgres-progress.repository';

export const lessonHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_LESSONS_HANDLER,
		useFactory(lessonRepository: ILessonRepository) {
			return new ListLessonsHandler(lessonRepository);
		},
		inject: [PostgresLessonRepository],
	},
	{
		provide: DiToken.FIND_LESSON_BY_ID_HANDLER,
		useFactory(lessonRepository: ILessonRepository) {
			return new FindLessonByIdHandler(lessonRepository);
		},
		inject: [PostgresLessonRepository],
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
			lessonRepository: ILessonRepository,
			eventBus: IEventBus,
		) {
			return new StartLessonHandler(
				lessonProgressRepository,
				lessonRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLessonProgressRepository,
			PostgresLessonRepository,
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
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new ListLessonProgressHandler(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
	{
		provide: DiToken.FIND_LESSON_PROGRESS_FOR_USER_HANDLER,
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new FindLessonProgressForUserHandler(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
];
