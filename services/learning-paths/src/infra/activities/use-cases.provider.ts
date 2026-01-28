import type { Provider } from '@nestjs/common';
import {
	CreateArticleUseCase,
	CreateExerciseUseCase,
	CreateQuizUseCase,
	FindActivitiesUseCase,
	FindOneActivityUseCase,
	FindOneArticleUseCase,
	FindOneExerciseUseCase,
	FindOneQuizUseCase,
	RemoveActivityUseCase,
	UpdateArticleUseCase,
	UpdateExerciseUseCase,
	UpdateQuizUseCase,
} from '@/app/activities/use-cases';
import { DiToken } from '../common/enums';
import { PostgresActivitiesRepository } from './postgres.repository';

export const activitiesUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_ACTIVITIES_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindActivitiesUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_ACTIVITY_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindOneActivityUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_ARTICLE_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindOneArticleUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_EXERCISE_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindOneExerciseUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_QUIZ_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindOneQuizUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.CREATE_ARTICLE_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new CreateArticleUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.CREATE_EXERCISE_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new CreateExerciseUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.CREATE_QUIZ_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new CreateQuizUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.UPDATE_ARTICLE_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new UpdateArticleUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new UpdateExerciseUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.UPDATE_QUIZ_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new UpdateQuizUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new RemoveActivityUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
];
