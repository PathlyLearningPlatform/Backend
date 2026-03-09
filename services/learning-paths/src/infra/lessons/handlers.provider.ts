import type { Provider } from '@nestjs/common';
import type { ILessonRepository } from '@/domain/lessons/interfaces';
import type { ILessonReadRepository } from '@/app/lessons/interfaces';
import type { IUnitRepository } from '@/domain/units/interfaces';
import type { IActivityRepository } from '@/domain/activities/interfaces';
import { DiToken } from '../common/enums';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonReadRepository } from './postgres-read.repository';
import { PostgresUnitRepository } from '../units/postgres.repository';
import { PostgresActivityRepository } from '../activities/postgres.repository';
import {
	ListLessonsHandler,
	FindLessonByIdHandler,
} from '@/app/lessons/queries';
import {
	UpdateLessonHandler,
	RemoveLessonHandler,
	AddArticleHandler,
	AddExerciseHandler,
	AddQuizHandler,
	ReorderActivityHandler,
} from '@/app/lessons/commands';
import { AddLessonHandler, ReorderLessonHandler } from '@/app/units/commands';

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
];
