import type { Provider } from '@nestjs/common';
import {
	AddExerciseHandler,
	FindExerciseByIdHandler,
	ListExercisesHandler,
	UpdateExerciseHandler,
} from '@app/exercises';
import type { IActivityRepository } from '@/domain/activities';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresActivityRepository } from '@infra/activities/postgres.repository';

export const exerciseHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_EXERCISES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListExercisesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindExerciseByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new UpdateExerciseHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.ADD_EXERCISE_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new AddExerciseHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
];
