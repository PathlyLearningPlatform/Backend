import type { Provider } from '@nestjs/common';
import {
	AddExerciseHandler,
	FindExerciseByIdHandler,
	ListExercisesHandler,
	UpdateExerciseHandler,
} from '@app/exercises';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresExerciseRepository } from './postgres.repository';
import { IExerciseRepository } from '@/domain/exercises/repositories';

export const exerciseHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_EXERCISES_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new ListExercisesHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_BY_ID_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new FindExerciseByIdHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new UpdateExerciseHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.ADD_EXERCISE_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			exerciseRepository: IExerciseRepository,
		) {
			return new AddExerciseHandler(lessonRepository, exerciseRepository);
		},
		inject: [PostgresLessonRepository, PostgresExerciseRepository],
	},
];
