import type { Provider } from '@nestjs/common';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import {
	CreateLessonUseCase,
	FindLessonsUseCase,
	FindOneLessonUseCase,
	RemoveLessonUseCase,
	UpdateLessonUseCase,
} from '@/app/lessons/use-cases';
import type { IUnitsRepository } from '@/app/units/interfaces';
import { DiToken } from '../common/enums';
import { PostgresUnitsRepository } from '../units/postgres.repository';
import { PostgresLessonsRepository } from './postgres.repository';

export const lessonsUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_LESSONS_USE_CASE,
		useFactory(lessonsRepository: ILessonsRepository) {
			return new FindLessonsUseCase(lessonsRepository);
		},
		inject: [PostgresLessonsRepository],
	},
	{
		provide: DiToken.FIND_ONE_LESSON_USE_CASE,
		useFactory(lessonsRepository: ILessonsRepository) {
			return new FindOneLessonUseCase(lessonsRepository);
		},
		inject: [PostgresLessonsRepository],
	},
	{
		provide: DiToken.CREATE_LESSON_USE_CASE,
		useFactory(
			lessonsRepository: ILessonsRepository,
			unitsRepository: IUnitsRepository,
		) {
			return new CreateLessonUseCase(lessonsRepository, unitsRepository);
		},
		inject: [PostgresLessonsRepository, PostgresUnitsRepository],
	},
	{
		provide: DiToken.UPDATE_LESSON_USE_CASE,
		useFactory(lessonsRepository: ILessonsRepository) {
			return new UpdateLessonUseCase(lessonsRepository);
		},
		inject: [PostgresLessonsRepository],
	},
	{
		provide: DiToken.REMOVE_LESSON_USE_CASE,
		useFactory(lessonsRepository: PostgresLessonsRepository) {
			return new RemoveLessonUseCase(lessonsRepository);
		},
		inject: [PostgresLessonsRepository],
	},
];
